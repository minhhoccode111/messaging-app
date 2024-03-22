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
  let joinedGroups = await GroupMember.find({ user: req.user }).sort({ isCreator: 1 }).populate('group', 'name public avatarLink createdAt').exec();

  joinedGroups = joinedGroups.map((ref) => ({
    // extract needed fields from populated group field
    _id: ref?.group?._id,
    name: ref?.group?.name,
    public: ref?.group?.public,
    avatarLink: ref?.group?.avatarLink,
    createdAt: ref?.group?.createdAt,
    isCreator: ref.isCreator,
    // joinedAt:
  }));

  // console.log(joinedGroups);

  // find in g
  const notJoinedGroups = await Group.find({ _id: { $nin: joinedGroups } }, 'name public avatarLink createdAt').exec();

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

      group.save(); // can throw if group name exists
      //

      return res.json({ requestedUser: req.user, createdGroup: group });
    }

    errors = errors.reduce((total, current) => [...total, current.msg], []);

    return res.status(400).json({ errors });
  }),
];

// get conversation with a specific group
module.exports.chat_group_get = asyncHandler(async (req, res, next) => {
  res.send('chat group get: not implemented');
});

// post a message with a specific group
module.exports.chat_group_post = asyncHandler(async (req, res, next) => {
  res.send('chat group post: not implemented');
});

// delete a specific group (current logged in user is group's creator)
module.exports.chat_group_delete = asyncHandler(async (req, res, next) => {
  res.send('chat group delete: not implemented');
});

// update a specific group (current logged in user is group's creator)
module.exports.chat_group_put = asyncHandler(async (req, res, next) => {
  res.send('chat group put: not implemented');
});

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
