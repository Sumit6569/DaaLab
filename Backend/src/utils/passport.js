import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Student } from '../models/student.model.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
},

async function(request, accessToken, refreshToken, profile, done) {
  // console.log("profile : ", profile);
  try {
    const existingStudent = await Student.findOne({ email: profile.emails[0].value });
    if (existingStudent) {
      // If Student exists, update their information
      existingStudent.providerId = profile.id;
      existingStudent.fullName = profile.displayName;
      existingStudent.image = {
        url: profile.photos[0].value,
        filename: `google${profile.id}`,
      };
      await existingStudent.save();
      return done(null, existingStudent);
    } else {
      console.log("Creating a new Student");
      const newStudent = new Student({
        providerId: profile.id,
        provider: 'Student',
        fullName: profile.displayName,
        email: profile.emails[0].value,
        image: {
          url: profile.photos[0].value,
          filename: `google${profile.id}`,
        },
        password: null, // Set password to null for Google OAuth Students
      });

      // Save the new Student and handle potential errors
      try {
        await newStudent.save();
        console.log("New Student created:", newStudent);
        return done(null, newStudent);
        
      } catch (err) {
        if (err.code === 11000) {
          // Handle duplicate key error
           console.error("Error saving new Student:", err);
          console.error('Student with this email already exists.');
          const existingStudent = await Student.findOne({ email: profile.emails[0].value });
          return done(null, existingStudent); // Return the existing Student
        } else {
          // Handle other errors
          console.error(err);
          return done(err, null);
        }
      }
    }
  } catch (err) {
    console.error("Error during authentication: ", err);
    return done(err, null);
  }
}));



passport.serializeUser((student, done) => {
  console.log("Serializing student:", student);
  done(null, student.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const student = await Student.findById(id);
    done(null, student);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
