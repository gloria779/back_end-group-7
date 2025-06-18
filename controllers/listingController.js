const Listing = require('../models/listingModel');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const streamifier = require('streamifier');

const ALLOWED_HOSTELS = [
  'Sky Courts', 'Premium', 'Jones', "David's Ark", 'Vienna', 'Tupendane', 'Soso'
];

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
      if (err) reject(err);
      else resolve(result.secure_url);
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
}

exports.getAllListings = async (req, res) => {
  const { hostel } = req.query;
  let filters = {};
  if (hostel && ALLOWED_HOSTELS.includes(hostel)) {
    filters.hostel = hostel;
  }
  const listings = await Listing.getAll(filters);
  res.json(listings);
};

exports.getListing = async (req, res) => {
  const listing = await Listing.getById(req.params.id);
  if (!listing) return res.sendStatus(404);
  res.json(listing);
};

exports.createListing = async (req, res) => {
  const {
    title, type, price, location, features, description,
    latitude, longitude, hostel
  } = req.body;
  if (!ALLOWED_HOSTELS.includes(hostel)) {
    return res.status(400).json({ message: 'Invalid hostel selected.' });
  }
  const landlord_id = req.user.id;
  let images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const url = await uploadToCloudinary(file.buffer);
      images.push(url);
    }
  }
  const id = await Listing.create({
    title,
    type,
    price,
    location,
    features: features ? JSON.parse(features) : [],
    description,
    latitude,
    longitude,
    landlord_id,
    images,
    hostel
  });
  res.status(201).json({ id });
};

exports.updateListing = async (req, res) => {
  const {
    title, type, price, location, features, description,
    latitude, longitude, hostel
  } = req.body;
  if (!ALLOWED_HOSTELS.includes(hostel)) {
    return res.status(400).json({ message: 'Invalid hostel selected.' });
  }
  await Listing.update(req.params.id, {
    title,
    type,
    price,
    location,
    features: features ? JSON.parse(features) : [],
    description,
    latitude,
    longitude,
    images: [], // Add logic to update images if you want
    hostel
  });
  res.json({ message: 'Listing updated' });
};

exports.deleteListing = async (req, res) => {
  await Listing.delete(req.params.id);
  res.json({ message: 'Listing deleted' });
};

exports.approveListing = async (req, res) => {
  await Listing.approve(req.params.id);
  res.json({ message: 'Listing approved' });
};