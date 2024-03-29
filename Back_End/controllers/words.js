const { default: mongoose } = require("mongoose");
const path = require('path');
const upload = require('../middleware/multer');
// GCS
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("pete-bucket-1068");
// Model
const Word = require("../models/Word");
const Animation = require('../models/Animation');


// Get all word
const getWord = async (req, res) => {
  try {
    const foundWord = await Word.find({});
    res.status(200).json({ data: foundWord });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Word by ID
const getWordByID = async (req, res) => {
  const { wordID } = req.params;

  try {
    const word = await Word.findById({ _id: wordID });
    res.status(200).json({ data: word });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Search by word
const getWordBySearch = async (req, res) => {
  const { word } = req.query;
  const searchWord = new RegExp(word, "i");
  try {
    const foundWord = await Word.find({ word: searchWord });
    res.status(200).json({ data: foundWord });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Create New Word
const createWord = async (req, res) => {
  await upload.uploadLocalMiddleware(req, res)
  const { word, description } = req.body;
  const newWord = new Word({ word, description });

  try {
    await newWord.save();
    res.status(201).json(newWord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Edit Selected Word
const editWord = async (req, res) => {
  const { wordID } = req.params
  await upload.uploadLocalMiddleware(req, res)
  const { word, description } = req.body
  const verifyWordID = mongoose.Types.ObjectId.isValid(wordID);
  if (!verifyWordID) {
    res.status(400).json("wordID isn't ObjectID");
  } else {
    try {
      const updatedWord = await Word.findByIdAndUpdate(
        { _id: wordID },
        {
          $set: {
            word,
            description,
          }
        },
        { new: true }
      );
      if (updatedWord) {
        res.status(200).json(updatedWord);
      } else {
        res.status(200).json("No word edited");
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

// Delete Selected word
const deleteWord = async (req, res) => {
  const { wordID } = req.params;
  const verifyWordID = mongoose.Types.ObjectId.isValid(wordID);
  if (!verifyWordID) {
    res.status(400).send("wordID is not ObjectID");
  } else {
    
    try {
      const animations = await Animation.find({ wordID: wordID }, 'file') // query for for filename to delete on cloud
      const fileNames = animations.map(animation => {
        const fileURL = animation.file;
        const filename = path.basename(fileURL);
        return filename;
      })
      const relatedAnimation = await Animation.deleteMany({ wordID: wordID })
      const deletedWord = await Word.findByIdAndDelete({ _id: wordID });
      for (const fileName of fileNames) {
        if (fileName) {
          const [file] = await bucket.file(fileName).get()
          const deleteOptions = {
            ifGenerationMatch: file.generation,
          };
          await bucket.file(fileName).delete(deleteOptions)
        }
      }

      if (deletedWord && relatedAnimation) {
        res.status(200).json({ message: `Word "${deletedWord.word}" and related animation has been deleted` });
      } else if (deletedWord) {
        res.status(200).json({ message: `Word "${deletedWord.word}" has been deleted` });
      } else {
        res.status(200).json({ message: "No word to delete" });
      }

    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

module.exports = {
  getWordBySearch,
  getWord,
  createWord,
  deleteWord,
  getWordByID,
  editWord
};
