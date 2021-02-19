const path = require("path");
const crypto = require("crypto");
const dir = path.join(__dirname, "../views/donor");

const axios = require("axios");
const alert = require("alert-node");

const url = require("../config/url");
const { portGenerator } = require("../helpers/helper");

// To open signin and signup form
module.exports.getSignIn = (req, res) => {
  res.status(200).render(`${dir}/signin`);
};

module.exports.getSignUp = (req, res) => {
  res.status(200).render(`${dir}/signup`);
};

//Donor use
module.exports.donateOrgan = async(req, res) => {
  const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.personId));
  console.log(blockchainUrl);
  try {
    const result = await axios({
      //url:`${process.env.URL}/api/Organ`,
      url:`${blockchainUrl}/Organ`,
      method:'GET'
    });
    result.data.forEach((element)=>{
      if(element.donor.split("#")[1] === res.locals.donor.personId){
        res.locals.donated = element.donor;
      }
    
    });
  } catch (error) {
    console.log(error.response);
  }
  res.status(200).render(`${dir}/donateOrgan`);
};

module.exports.getProfile = (req, res) => {
  if (req.originalUrl === "/signedin") res.redirect("/donor/profile");
  res.status(200).render(`${dir}/profile`);
};

module.exports.getCheckup = async (req, res) => {
  const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.personId));
  try {
    const result = await axios({
      url: `${blockchainUrl}/queries/selectOrganByDonor?donor=resource%3Aorg.organdonation.Donor%23${res.locals.donor.personId}`,
      method: 'GET',
    });
    
    let organs = [];
    console.log(result.data);
    result.data.forEach((organ)=> {
      const donorName = organ.donor.split("#")[1];
      if (
        organ.status === "OFFERED" &&
        donorName=== res.locals.donor.personId &&
        !organ.sourceHospital
      ) 

      organs.push(organ);
    });
    
    res.locals.myOrgans = organs ;
    if(organs.length > 0){
    const hospital = await axios({
      url:`${blockchainUrl}/Hospital`,
      method:'GET'
    });
    console.log(hospital.data);
    res.locals.hospitals = hospital.data;
  }
  
  res.status(200).render(`${dir}/checkUp`);
  } 
  catch (error) {
    console.log(error);
    res.status(200).render(`${dir}/checkUp`);
  }

};

module.exports.submitOrgan = async (req, res) => {
  const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.personId));
  req.body.organId = crypto.randomBytes(16).toString("hex");
  console.log(req.body);
  try {
      const result = await axios({
      url: `${blockchainUrl}/Offered`,
      method: "POST",
      data: req.body,
      json: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      alert("Organ Submitted");
      return res.redirect("http://localhost:8000/donor/donateorgan");
    }

  } catch (error) {
    console.log(error.response.data);
    alert("Error in submitting Organ");
    return res.redirect("http://localhost:8000/donor/donateorgan");
  }
};

module.exports.getAppointment = async (req, res) => {
  const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.personId));
  const organId = req.body.organId;
  delete req.body.organId;
  req.body.status = "OFFERED";
  try {
    const result = await axios({
      url: `${blockchainUrl}/Organ/${organId}`,
      method: "PUT",
      data: req.body,
      json: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(result.data);
    if (result.status === 200) {
      alert("Appointment for Checkup Submitted");
      return res.redirect("http://localhost:8000/donor/checkup");
    }
  } catch (error) {
    console.log(error.response.data);
    alert("Appointment for Checkup could not be Submitted");
    return res.redirect("http://localhost:8000/donor/checkup");
  }
};
