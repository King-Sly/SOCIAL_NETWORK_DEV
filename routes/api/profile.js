const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require('../../models/Profile');
const User = require("../../models/Profile");
const {check, validationResult} = require('express-validator');

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
        console.log("KDKD1234");
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

module.exports = router;