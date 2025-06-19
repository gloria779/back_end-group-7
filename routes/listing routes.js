const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const authorizeRoles = require('../middleware/roles');
const upload = require('../middleware/upload');
const {
  getAllListings, getListing, createListing,
  updateListing, deleteListing, approveListing
} = require('../controllers/listingController');


router.get('/', getAllListings);
router.get('/:id', getListing);


router.post(
  '/',
  authenticateJWT,
  authorizeRoles('landlord'),
  upload.array('images', 5),
  createListing
);
router.patch(
  '/:id',
  authenticateJWT,
  authorizeRoles('landlord', 'admin'),
  upload.array('images', 5),
  updateListing
);
router.delete('/:id', authenticateJWT, authorizeRoles('landlord', 'admin'), deleteListing);


router.patch('/:id/approve', authenticateJWT, authorizeRoles('admin'), approveListing);

module.exports = router;