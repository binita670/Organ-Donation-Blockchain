const express = require("express");
const router = express.Router();
const hospitalController = require("./../controller/hospitalController.js");
const authController = require("../controller/authController");

router.use(authController.isLoggedIn("Hospital"));

router.get("/", hospitalController.hospitalLogin);
router.post(
  "/login",
  hospitalController.loginHospital,
  authController.isLoggedIn("Hospital"),
  hospitalController.organTest
);

router.use(authController.protectRoute("Hospital"));

router.get("/organtest", hospitalController.organTest);
router.get("/recipientregister", hospitalController.registerRecipient);
router.get("/donorlist", hospitalController.hospitaldonorlist);
router.get("/recieverlist",hospitalController.hospitalrecieverlist);
router.get("/transplant", hospitalController.getTransplant);
router.get('/transplanthistory', hospitalController.gettransplanthistory);

router.get("/logout", authController.getLoggedOut("hospital"));

router.post("/submitmedicaldetails" , hospitalController.submitMedicalDetails);

router.post("/registerrecipient", hospitalController.getRegisterRecipient);

router.post("/transplanted", hospitalController.organTransplanted);

module.exports = router;
