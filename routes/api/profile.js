const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require("../../middleware/auth");
const Profile = require('../../models/Profile');
const User = require("../../models/Profile");
const {check, validationResult} = require('express-validator');
const { response } = require('express');

//we can always access user.id which is same as user._id
// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user : req.user.id}).populate('user', ['name', 'avatar']);

        if(!profile) {
            return res.status(400).json({msg : "There is no profile for this user"});
        }
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile
// @desc    CREATE OR UPDATE USER PROFILE
// @access  Private
router.post('/', [
    auth, 
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
],  
    async (req, res) => {
        // console.log("KDKD1234");
        //PERFORM OUR VALIDATION==With the skills and status needed
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors : errors.array()});
        }  
        
        // destructure the request
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        // spread the rest of the fields we don't need to check
        ...rest
      } = req.body;
      
      // Build Profile object
      const profileFields = {};
      profileFields.user = req.user.id;
      if(company) profileFields.company = company;
      if(website) profileFields.website = website;
      if(location) profileFields.location = location;
      if(bio) profileFields.bio = bio;
      if(status) profileFields.status = status;
      if(githubusername) profileFields.githubusername = githubusername;
      if(skills) profileFields.skills = skills.split(',').map(skill => skill.trim());

      //Build Social object
      profileFields.social = {};
      if(youtube) profileFields.social.youtube = youtube;
      if(twitter) profileFields.social.twitter = twitter;
      if(facebook) profileFields.social.facebook = facebook;
      if(linkedin) profileFields.linkedin = linkedin;
      if(instagram) profileFields.instagram = instagram;

      // ALL DATA INCLUDED
      try {
          let profile = await Profile.findOne({user : req.user.id});

          if(profile) {
              
            //Update the profile
            profile = await Profile.findOneAndUpdate(
            {user : req.user.id}, 
            {$set : profileFields},
            {new : true}
            );
            return res.json(profile);
          }
           //Create

           profile = new Profile(profileFields);
           await profile.save();
           return res.json(profile);
          
      } catch(err) {
          console.log(err.message);
          res.status(500).send("Server Error");
      }
    // return res.json(profileFields);
});

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } 
     catch (err) {
         console.error(err.message);
         res.status(500).send("Server Error");
     }
});

// @route   GET api/profile/:user_id
// @desc    Get profile by user ID 
// @access  Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user : req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile) return res.status(400).json({msg : "Profile not found"});
        return res.json(profile);
    } 
     catch (err) {
         console.error(err.message);
         //checks if the user_id is a mongoose_ID
         //
         if(err.kind === 'ObjectId') res.status(400).json({msg : "profile not found"});
         res.status(500).send("Server Error");
     }
});


// @route   DELETE api/profile
// @desc    Delete profile, user and posts
// @access  Public
router.delete('/',auth, async (req, res) => {
    try {
        // @todo - remove users' posts 
        //Remove profile
        await Profile.findOneAndRemove({user : req.user.id});
        await User.findOneAndRemove({_id : req.user.id});
        res.json({msg : "User deleted"});
    } 
     catch (err) {
         console.error(err.message);
         res.status(500).send("Server Error");
     }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put('/experience', [auth,
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors : errors.array()});
    const {
        title, 
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({user : req.user.id});
        // if(!profile) return res.status(400).json("Something is wrong");

        profile.experience.unshift(newExp);
        await profile.save();
        // profile.experience.unshift(newExp);
        // await profile.save();
        return res.status(200).json("Experience added");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user : req.user.id});
        //Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        return res.json("Experience Deleted");
    } catch(err) {
        console.error(error.message);
        res.status(500).json("Experience not found");
    }
});


// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put('/education', [auth,
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of Study Date is required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors : errors.array()});
    const {
        school, 
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree, 
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({user : req.user.id});
        // if(!profile) return res.status(400).json("Something is wrong");

        profile.education.unshift(newEdu);
        await profile.save();
        // profile.experience.unshift(newExp);
        // await profile.save();
        return res.status(200).json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user : req.user.id});
        //Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        return res.status(200).json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});


// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get("/github/:username", (req, res) => {
    try {
        const options = {
            uri :  `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`, 
            method : 'GET', 
            headers : {"user-agent" : "node.js"}
        };
        request(options, (err, response, body) => {
            if(err) console.error(err);
            if(response.statusCode !== 200) {
                return res.status(404).json({msg : "No Github profile found"});
            }
            res.json(JSON.parse(body));
        })
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})
module.exports = router;