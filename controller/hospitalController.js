// const path = require("path");
// const dir = path.join(__dirname, "../views/hospital");
// const jwt = require("jsonwebtoken");
// const alert = require("alert-node");
// const axios = require("axios");
// const bcrypt = require("bcryptjs");

// // const url = require("../config/url");
// // const { portGenerator } = require("../helpers/helper");

// module.exports.hospitalLogin = (req, res) => {
//   res.status(200).render("Login");
// };

// module.exports.organTest = async (req, res) => {
//   //const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
//   if (req.originalUrl === "/hospital/login")
//     return res.redirect("/hospital/organtest");

//     try {
//       const result = await axios({
//         url:`${process.env.URL}/api/queries/selectOrganByHospital?sourceHospital=resource%3Aorg.organdonation.Hospital%23${res.locals.donor.hospitalId}`,
//         method:'GET'
//       });

//       const checkupOrgans = [];

//       const donorPromises = result.data.map( async(checkupOrgan) => {
//         if(checkupOrgan.status === "OFFERED"){
//           let donor = checkupOrgan.donor.split("#")[1];
//           const donorDetails = await axios({
//             url: `${process.env.URL}/api/Donor/${donor}`,
//             method: 'GET'
//           });
//           checkupOrgan.donor = donorDetails.data;
//           checkupOrgans.push(checkupOrgan);
//         }
//       });

//       await Promise.all(donorPromises);
//       res.locals.checkups =checkupOrgans;
//     } catch (error) {
//       console.log(error.response.data);
//     }
  
//   return res.status(200).render(`${dir}/organtest`);
// };

// module.exports.registerRecipient = (req, res) => {
//   res.status(200).render(`${dir}/recipientregister`);
// };

// module.exports.gettransplanthistory = (req, res)=> {
//   res.status(200).render(`${dir}/transplanthistory`);
// };

// module.exports.getTransplant = async (req, res) => {
//   //const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
//   try {
//     const result= await axios({
//       url:`${process.env.URL}/api/Organ`,
//       method:'GET'
//     });
  
//   const transplantlists = [];
//   const transplantpromise = result.data.map(async(element)=>{
//     if(element.status === "MATCHED"){
//       if(element.sourceHospital.split("#")[1] === res.locals.donor.hospitalId || element.destHospital.split("#")[1]  === res.locals.donor.hospitalId){
//         const donor = await axios({
//           url:`${process.env.URL}/api/Donor/${element.donor.split("#")[1]}`,
//           method:'GET'
//         });
//         const receiver = await axios({
//           url:`${process.env.URL}/api/Recipient/${element.recipient.split("#")[1]}`,
//           method:'GET'
//         });
//         element.donorDetails = donor.data;
//         element.receiverDetails = receiver.data;
//         transplantlists.push(element);
//       }
//     }
//   });
//   await Promise.all(transplantpromise);
//   res.locals.transplantLists = transplantlists;
//   } catch (error) {
//     console.log(error.response.data); 
//   }
//   res.status(200).render( `${dir}/transplant`);
// };


// module.exports.organTransplanted=async (req,res)=>{
//   //const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
//   req.body.organ = req.body.organId;
//   delete req.body.organId;
//   try {
//       const transplantResult = await axios({
//       url:`${process.env.URL}/api/Transplant`,
//       method:'POST',
//       data : req.body,
//       json: true,
//       headers:{
//         'Content-Type':'application/json'
//       }
//     });
//     if(transplantResult.status === 200){
//       console.log("success");
//       res.status(200).redirect("http://localhost:8000/hospital/transplant");
//     }
//   } catch (error) {
//     console.log(error.response.data);
//     res.status(200).redirect("http://localhost:8000/hospital/transplant");
//   }

// }



// module.exports.getRegisterRecipient =async(req,res)=>{
//   //const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
//   const testInfo={
//     bloodType: req.body.bloodType,
//     proteinOne: req.body.proteinOne,
//     proteinTwo: req.body.proteinTwo,
//     doctor: req.body.doctor,
//   }
//   req.body.organTestInfo = JSON.stringify(testInfo);
//   delete req.body.proteinOne;
//   delete req.body.proteinTwo;
//   delete req.body.doctor;
//   delete req.body.bloodType;
//   req.body.personId = req.body.emailId;
//   req.body.hospital = res.locals.donor.hospitalId;
//   try {
//     const result = await axios({
//       url: `${process.env.URL}/api/Recipient`,
//       method:'POST',
//       data:req.body,
//       json:true,
//       headers:{
//         'Content-Type':'application/json'
//       }
//     });
//     console.log("success");
//   } catch (error) {
//     console.log(error.response);
//   }
//   res.status(200).redirect("http://localhost:8000/hospital/recipientregister");
// }

// module.exports.loginHospital = async (req, res, next) => {
//   try {

//     const result = await axios({
//       url: `${process.env.URL}/api/Hospital/${req.body.emailId}`,
//       method: "GET",
//     });
//     // console.log(url.replace("$PORT", portGenerator("networkadmin")));
//     // const result = await axios({
//     //   url: `${url.replace("$PORT", portGenerator("networkadmin"))}/Hospital/${req.body.emailId}`,
//     //   method: "GET",
//     // });

//     const validPassword = await bcrypt.compare(
//       req.body.password,
//       result.data.password
//     );
//     if (validPassword) {
//       const token = jwt.sign(
//         { emailId: req.body.emailId },
//         process.env.MY_SECRET_KEY
//       );
//       res.cookie("jwt", token, {
//         expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
//         httpOnly: true,
//       });
//       return next();
//     } else {
//       alert("Invalid email or password");
//       return res.redirect("http://localhost:8000/hospital");
//     }
//   } catch (error) {
//     console.log("INSIDE CATCH");
//     console.log(error);
//     alert("Invalid email or password");
//     return res.redirect("http://localhost:8000/hospital");
//   }
// };


// module.exports.submitMedicalDetails = async (req,res)=>{
//   //const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
//   req.body.hospital = res.locals.donor.hospitalId;
//   req.body.doctor = req.body.organTestInfo.doctor;
//   req.body.organ = req.body.organTestInfo.organId;
//   delete req.body.organTestInfo.doctor;
//   delete req.body.organTestInfo.organId;
//  req.body.organTestInfo = JSON.stringify(req.body.organTestInfo);
//   console.log(req.body);
//   try {
//     const result = await axios({
//       url:`${process.env.URL}/api/Tested`,
//       method:'POST',
//       data:req.body,
//       json:true,
//       headers:{
//         'Content-Type':'application/json'
//       },
//   });
//   if(result.status=== 200)
//   {
//     console.log("Success");
//     return res.redirect("http://localhost:8000/hospital/organtest");
//   }
//   } catch (error) {
//     console.log(error);
//     return res.redirect("http://localhost:8000/hospital/organtest");
//   }
// }

// module.exports.hospitaldonorlist = async(req,res)=>{
//   //const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
//   try {
//     const result = await axios({
//       url:`${process.env.URL}/api/Organ`,
//       method:`GET`,
//     });

//     const hospitalDonors = [];

//     const donorPromise = result.data.map(async(organdetails)=>{
//       if(organdetails.sourceHospital.split("#")[1] === res.locals.donor.hospitalId){
//             const hospitaldonor = await axios({
//                 url:`${process.env.URL}/api/Donor/${organdetails.donor.split("#")[1]}`,
//                 method:'GET'
//             });
//             organdetails.donor = hospitaldonor.data;
//             hospitalDonors.push(organdetails);
//       }
//     });
//     await Promise.all(donorPromise);
//     console.log(hospitalDonors);
//     res.locals.hospitaldonors = hospitalDonors;
//   } catch (error) {
//     console.log(error.response);
//   }
 
//   res.status(200).render(`${dir}/hospitaldonorlist`);
// }

// module.exports.hospitalrecieverlist = async(req,res)=>{
//   //const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
//   try {
//     const result = await axios({
//       url:`${process.env.URL}/api/Recipient`,
//       method:'GET'
//     });

//     const recieverlists=[];

//     result.data.forEach((reciever)=>{
//         if(reciever.hospital.split("#")[1] === res.locals.donor.hospitalId){
//           recieverlists.push(reciever);
//         }
//     });
//     res.locals.recieverLists = recieverlists;
//   } catch (error) {
//     console.log(error.response);
//   }
//   res.status(200).render(`${dir}/reciepientlist`);
// }




const path = require("path");
const dir = path.join(__dirname, "../views/hospital");
const jwt = require("jsonwebtoken");
const alert = require("alert-node");
const axios = require("axios");
const bcrypt = require("bcryptjs");

const url = require("../config/url");
const { portGenerator } = require("../helpers/helper");

module.exports.hospitalLogin = (req, res) => {
  res.status(200).render("Login");
};

module.exports.organTest = async (req, res) => {
  const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
  if (req.originalUrl === "/hospital/login")
    return res.redirect("/hospital/organtest");

    try {
      const result = await axios({
        url:`${blockchainUrl}/queries/selectOrganByHospital?sourceHospital=resource%3Aorg.organdonation.Hospital%23${res.locals.donor.hospitalId}`,
        method:'GET'
      });

      const checkupOrgans = [];

      const donorPromises = result.data.map( async(checkupOrgan) => {
        if(checkupOrgan.status === "OFFERED"){
          let donor = checkupOrgan.donor.split("#")[1];
          const donorDetails = await axios({
            url: `${blockchainUrl}/Donor/${donor}`,
            method: 'GET'
          });
          checkupOrgan.donor = donorDetails.data;
          checkupOrgans.push(checkupOrgan);
        }
      });

      await Promise.all(donorPromises);
      res.locals.checkups =checkupOrgans;
    } catch (error) {
      console.log(error.response.data);
    }
  
  return res.status(200).render(`${dir}/organtest`);
};

module.exports.registerRecipient = (req, res) => {
  res.status(200).render(`${dir}/recipientregister`);
};

module.exports.gettransplanthistory = async(req, res)=> {
  const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
  try {
    const result= await axios({
      url:`${blockchainUrl}/Organ`,
      method:'GET'
    });
  
  const transplantlists = [];
  const transplantpromise = result.data.map(async(element)=>{
    if(element.status === "TRANSPLANT"){
      if(element.sourceHospital.split("#")[1] === res.locals.donor.hospitalId || element.destHospital.split("#")[1]  === res.locals.donor.hospitalId){
        const donor = await axios({
          url:`${blockchainUrl}/Donor/${element.donor.split("#")[1]}`,
          method:'GET'
        });
        const receiver = await axios({
          url:`${blockchainUrl}/Recipient/${element.recipient.split("#")[1]}`,
          method:'GET'
        });
        element.donorDetails = donor.data;
        element.receiverDetails = receiver.data;
        transplantlists.push(element);
      }
    }
  });
  await Promise.all(transplantpromise);
  res.locals.transplantLists = transplantlists;
  } catch (error) {
    console.log(error.response.data); 
  }
  res.status(200).render(`${dir}/transplanthistory`);
};

module.exports.getTransplant = async (req, res) => {
  const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
  try {
    const result= await axios({
      url:`${blockchainUrl}/Organ`,
      method:'GET'
    });
  
  const transplantlists = [];
  const transplantpromise = result.data.map(async(element)=>{
    if(element.status === "MATCHED"){
      if(element.sourceHospital.split("#")[1] === res.locals.donor.hospitalId || element.destHospital.split("#")[1]  === res.locals.donor.hospitalId){
        const donor = await axios({
          url:`${blockchainUrl}/Donor/${element.donor.split("#")[1]}`,
          method:'GET'
        });
        const receiver = await axios({
          url:`${blockchainUrl}/Recipient/${element.recipient.split("#")[1]}`,
          method:'GET'
        });
        element.donorDetails = donor.data;
        element.receiverDetails = receiver.data;
        transplantlists.push(element);
      }
    }
  });
  await Promise.all(transplantpromise);
  res.locals.transplantLists = transplantlists;
  } catch (error) {
    console.log(error.response.data); 
  }
  res.status(200).render( `${dir}/transplant`);
};


module.exports.organTransplanted=async (req,res)=>{
  const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
  req.body.organ = req.body.organId;
  delete req.body.organId;
  try {
      const transplantResult = await axios({
      url:`${blockchainUrl}/Transplant`,
      method:'POST',
      data : req.body,
      json: true,
      headers:{
        'Content-Type':'application/json'
      }
    });
    if(transplantResult.status === 200){
      console.log("success");
      res.status(200).redirect("http://localhost:8000/hospital/transplant");
    }
  } catch (error) {
    console.log(error.response.data);
    res.status(200).redirect("http://localhost:8000/hospital/transplant");
  }

}

module.exports.getRegisterRecipient =async(req,res)=>{
  const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
  const testInfo={
    bloodType: req.body.bloodType,
    proteinOne: req.body.proteinOne,
    proteinTwo: req.body.proteinTwo,
    doctor: req.body.doctor,
  }
  req.body.organTestInfo = JSON.stringify(testInfo);
  delete req.body.proteinOne;
  delete req.body.proteinTwo;
  delete req.body.doctor;
  delete req.body.bloodType;
  req.body.personId = req.body.emailId;
  req.body.hospital = res.locals.donor.hospitalId;
  try {
    const result = await axios({
      url: `${blockchainUrl}/Recipient`,
      method:'POST',
      data:req.body,
      json:true,
      headers:{
        'Content-Type':'application/json'
      }
    });
    console.log("success");
  } catch (error) {
    console.log(error.response);
  }
  res.status(200).redirect("http://localhost:8000/hospital/recipientregister");
}

module.exports.loginHospital = async (req, res, next) => {
  try {
    // console.log(url.replace("$PORT", portGenerator("networkadmin")));
    const result = await axios({
      url: `${url.replace("$PORT", portGenerator("networkadmin"))}/Hospital/${req.body.emailId}`,
      method: "GET",
    });

    const validPassword = await bcrypt.compare(
      req.body.password,
      result.data.password
    );
    if (validPassword) {
      const token = jwt.sign(
        { emailId: req.body.emailId },
        process.env.MY_SECRET_KEY
      );
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      req.hospital= token;
      return next();
    } else {
      alert("Invalid email or password");
      return res.redirect("http://localhost:8000/hospital");
    }
  } catch (error) {
    console.log("INSIDE CATCH");
    console.log(error);
    alert("Invalid email or password");
    return res.redirect("http://localhost:8000/hospital");
  }
};


module.exports.submitMedicalDetails = async (req,res)=>{
  const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
  req.body.hospital = res.locals.donor.hospitalId;
  req.body.doctor = req.body.organTestInfo.doctor;
  req.body.organ = req.body.organTestInfo.organId;
  delete req.body.organTestInfo.doctor;
  delete req.body.organTestInfo.organId;
 req.body.organTestInfo = JSON.stringify(req.body.organTestInfo);
  console.log(req.body);
  try {
    const result = await axios({
      url:`${blockchainUrl}/Tested`,
      method:'POST',
      data:req.body,
      json:true,
      headers:{
        'Content-Type':'application/json'
      },
  });
  if(result.status=== 200)
  {
    console.log("Success");
    return res.redirect("http://localhost:8000/hospital/organtest");
  }
  } catch (error) {
    console.log(error);
    return res.redirect("http://localhost:8000/hospital/organtest");
  }
}

module.exports.hospitaldonorlist = async(req,res)=>{
  const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
  try {
    const result = await axios({
      url:`${blockchainUrl}/Organ`,
      method:`GET`,
    });

    const hospitalDonors = [];

    const donorPromise = result.data.map(async(organdetails)=>{
      if(organdetails.sourceHospital.split("#")[1] === res.locals.donor.hospitalId){
            const hospitaldonor = await axios({
                url:`${blockchainUrl}/Donor/${organdetails.donor.split("#")[1]}`,
                method:'GET'
            });
            organdetails.donor = hospitaldonor.data;
            hospitalDonors.push(organdetails);
      }
    });
    await Promise.all(donorPromise);
    console.log(hospitalDonors);
    res.locals.hospitaldonors = hospitalDonors;
  } catch (error) {
    console.log(error.response);
  }
 
  res.status(200).render(`${dir}/hospitaldonorlist`);
}

module.exports.hospitalrecieverlist = async(req,res)=>{
  const blockchainUrl = url.replace("$PORT", portGenerator(res.locals.donor.hospitalId));
  try {
    const result = await axios({
      url:`${blockchainUrl}/Recipient`,
      method:'GET'
    });
     
    const recieverlists=[];

    const RecieverPromise = result.data.map(async(reciever)=>{
      if(reciever.allocatedOrgan){
        const organId = reciever.allocatedOrgan.split('#')[1];
        const organ = await axios({
          url:`${blockchainUrl}/Organ/${organId}`,
          method:'GET'
        }); 
        if(organ.data.status ==='TRANSPLANT'){
          reciever.organStatus = "transplant";
        }
        if(reciever.hospital.split("#")[1] === res.locals.donor.hospitalId){
          recieverlists.push(reciever);
        }
      }
    });
    await Promise.all(RecieverPromise);

    // result.data.forEach((reciever)=>{
    //     if(reciever.hospital.split("#")[1] === res.locals.donor.hospitalId){
    //       recieverlists.push(reciever);
    //     }
    // });
    res.locals.recieverLists = recieverlists;
  } catch (error) {
    console.log(error.response);
  }
  res.status(200).render(`${dir}/reciepientlist`);
}


