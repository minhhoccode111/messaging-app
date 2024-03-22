// no need for try...catch block
const asyncHandler = require('express-async-handler');

// sanitize and validate data
const { body, validationResult } = require('express-validator');

// mongoose models
const User = require('./../models/user');
const Message = require('./../models/message');
const Group = require('./../models/group');
const GroupMember = require('./../models/groupMember');

// debug
const debug = require('debug')('xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx');

// mongoose to check valid req.params.postid
const mongoose = require('mongoose');

// get all group that visible to current logged in user (joined, public)
module.exports.chat_all_group_get = asyncHandler(async (req, res, next) => {
  // first get all current logged in user joined group references
  let joinedGroups = await GroupMember.find({ user: req.user }).sort({ isCreator: 1 }).populate('group', 'name public avatarLink').exec();

  joinedGroups = joinedGroups.map((ref) => ({
    // extract needed fields from populated group field
    _id: ref?.group?._id,
    name: ref?.group?.name,
    public: ref?.group?.public,
    avatarLink: ref?.group?.avatarLink,
    // createdAt: ref?.group?.createdAt,
    isCreator: ref.isCreator,
    // joinedAt:
  }));

  // console.log(joinedGroups);

  // find in g
  const notJoinedGroups = await Group.find({ _id: { $nin: joinedGroups } }, 'name public avatarLink').exec();

  // console.log(`notJoinedGroups belike: `, notJoinedGroups);

  const publicGroups = notJoinedGroups.filter((gr) => gr.public);
  const privateGroups = notJoinedGroups.filter((gr) => !gr.public);

  // console.log(`publicGroups belike: `, publicGroups);
  // console.log(`privateGroups belike: `, privateGroups);

  res.json({ requestedUser: req.user, joinedGroups, publicGroups, privateGroups });
});

// current logged in user create a new group (and be group's creator)
module.exports.chat_all_group_post = [
  body(`name`, `Group name should be between 8 and 60 characters.`).isLength({ min: 8, max: 60 }).trim().escape(),
  body(`bio`, `Group bio should be between 1 and 260 characters.`).isLength({ min: 1, max: 260 }).trim().escape(),
  asyncHandler(async (req, res, next) => {
    let errors = validationResult(req).array();

    const { name, bio, avatarLink } = req.body;

    // in case group name exists
    const countGroupName = await Group.countDocuments({ name }).exec();

    if (countGroupName > 0) {
      errors.push({ msg: `Group name exists.` });
    }

    if (!errors.length) {
      const group = new Group({ name, bio, avatarLink, public: req.body.public === 'true', creator: req.user });

      group.save();

      // BUG
      // create a reference between create and the group (first member)
      const creatorReference = new GroupMember({
        user: req.user,
        group,
        isCreator: true,
      });
      await creatorReference.save();

      return res.json({ requestedUser: req.user, createdGroup: group });
    }

    errors = errors.reduce((total, current) => [...total, current.msg], []);

    return res.status(400).json({ errors });
  }),
];

// get conversation with a specific group
module.exports.chat_group_get = asyncHandler(async (req, res, next) => {
  // check valid mongoose objectid before retrieve db
  const isValidId = mongoose.isValidObjectId(req.params.groupid);
  if (!isValidId) return res.sendStatus(404);

  // check if group we want really exists, populate all fields of group's creator
  const group = await Group.findById(req.params.groupid).populate('creator').exec();
  if (group === null) return res.sendStatus(404);

  // get all references of members in this group
  const groupMembers = await GroupMember.find({ group }).exec();

  // GroupMember to find reference between this current logged in user vs the group (check member and also creator at the same time)
  const userInGroupMembers = await GroupMember.findOne({ user: req.user, group }).exec();

  // current logged in user joined group or not
  const canReadMessages = userInGroupMembers !== null;

  let messages;

  if (canReadMessages) {
    messages = await Message.find().exec();
  }
  //
  else {
    messages = [];
  }

  return (
    res
      // base on user joined group or not
      .status(canReadMessages ? 200 : 403)
      .json({ requestedUser: req.user, receivedGroup: group, messages, groupMembers })
  );
});

// post a message with a specific group
module.exports.chat_group_post = asyncHandler(async (req, res, next) => {
  res.send('chat group post: not implemented');
});

// delete a specific group (current logged in user is group's creator)
module.exports.chat_group_delete = asyncHandler(async (req, res, next) => {
  // check valid mongoose objectid before retrieve db
  const isValidId = mongoose.isValidObjectId(req.params.groupid);
  if (!isValidId) return res.sendStatus(404);

  // check if group we want really exists
  const group = await Group.findById(req.params.groupid, '_id').populate('creator', '_id').exec();
  if (group === null) return res.sendStatus(404);

  // console.log(`the group's creator belike: `, group.creator.id);
  // console.log(`the req.user.id belike: `, req.user.id);
  // console.log(`compare both belike: `, req.user.id === group.creator.id);
  // console.log(`the group belike: `, group);

  // delete group that current logged in user not own
  if (req.user.id !== group?.creator?.id) return res.sendStatus(403);

  // first delete every references of the Group in GroupMember
  await GroupMember.deleteMany({ group: req.params.groupid });

  // then create the Group itself
  await Group.findByIdAndDelete(req.params.groupid);

  res.sendStatus(200);
});

// update a specific group (current logged in user is group's creator)
module.exports.chat_group_put = [
  body(`name`, `Group name should be between 8 and 60 characters.`).isLength({ min: 8, max: 60 }).trim().escape(),
  body(`bio`, `Group bio should be between 1 and 260 characters.`).isLength({ min: 1, max: 260 }).trim().escape(),
  asyncHandler(async (req, res, next) => {
    // check valid mongoose objectid before retrieve db
    const isValidId = mongoose.isValidObjectId(req.params.groupid);
    if (!isValidId) return res.sendStatus(404);

    // check if group we want really exists
    const oldGroup = await Group.findById(req.params.groupid, '_id name createdAt').populate('creator', '_id').exec();
    if (oldGroup === null) return res.sendStatus(404);

    let errors = validationResult(req).array();

    const { name, bio, avatarLink } = req.body;

    // in case group name exists and not belong to oldGroup
    const countGroupName = await Group.countDocuments({ name }).exec();
    if (countGroupName > 0 && oldGroup.name !== name) errors.push({ msg: `Group name exists.` });

    // forbidden current logged in user try to update group not own
    if (oldGroup.creator.id !== req.user.id) return res.sendStatus(403);

    if (!errors.length) {
      const newGroup = new Group({
        name,
        bio,
        avatarLink,
        public: req.body.public === 'true',
        creator: req.user,
        updatedAt: new Date(),
        createdAt: oldGroup.createdAt, // keep
        _id: oldGroup._id, // keep
      });

      // update the group
      await Group.findByIdAndUpdate(req.params.groupid, newGroup);

      return res.json({ requestedUser: req.user, updatedGroup: newGroup });
    }

    // turn to array of string
    errors = errors.reduce((total, current) => [...total, current.msg], []);

    return res.status(400).json({ errors });
  }),
];

// get all group's members
module.exports.chat_group_all_members_get = asyncHandler(async (req, res, next) => {
  res.send('chat group all members get: not implemented');
});

// post a member to a group
module.exports.chat_group_all_members_post = asyncHandler(async (req, res, next) => {
  res.send('chat group all members post: not implemented');
});

// delete a member from a group (leave or get kicked)
module.exports.chat_group_member_delete = asyncHandler(async (req, res, next) => {
  res.send('chat group all members post: not implemented');
});
