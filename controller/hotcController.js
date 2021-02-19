// const path = require('path');
// const dir = path.join(__dirname,"../views/hotc");
// const bcrypt = require('bcryptjs');
// const alertify = require('js-alert');
// //const alert = require('alert-node');
// const axios = require('axios');

// // const url = require("../config/url");
// // const { portGenerator } = require('../helpers/helper');
// // const blockchainUrl = url.replace("$PORT", portGenerator("networkadmin"));


// module.exports.hotcLogin=(req,res)=>{
//     res.status(200).render('Login');
// }

// module.exports.createHospital=async(req,res)=>{
//     res.status(200).render(`${dir}/createHospital`);
// }

// module.exports.getHotc=(req,res)=>{
//     res.status(200).render(`${dir}/hotc`);
// }

// module.exports.matchList =async(req,res)=>{
//     try {
//         const result = await axios({
//             url:`${process.env.URL}/api/Organ`,
//             method:'GET'
//         });

//         const recieverlists = [];
//         const reciever = await axios({
//             url:`${process.env.URL}/api/Recipient`,
//             method:'GET'
//         });
//         reciever.data.forEach((element)=>{
//             recieverlists.push(element);
//         });

//         res.locals.recieverToRecieve = recieverlists;

//         const donorsToDonate = [];

//         const donorPromise = result.data.map(async(donor)=>{
//             if(donor.status === "TESTED"){
//                 const donorToDonateDetails = await axios({
//                     url:`${process.env.URL}/api/Donor/${donor.donor.split("#")[1]}`,
//                     method:'GET'
//                 });
//                 donor.donor = donorToDonateDetails.data;
//                 donorsToDonate.push(donor);
//             }
//         });
//         await Promise.all(donorPromise);

//         res.locals.donorToDonate = donorsToDonate;

//     } catch (error) {
//         console.log(error.response);    
//     }
//     res.status(200).render(`${dir}/match`);
// }

// module.exports.viewHospital=async(req,res)=>{
//     try {
//         const result = await axios({
//             url:`${process.env.URL}/api/Hospital`,
//             method:'GET'
//         });
//         console.log(result.data);

//         let hospitalLists= [];
//         result.data.forEach((hospital)=>{
//             hospitalLists.push(hospital);
//         })
//         res.locals.hospitallists = hospitalLists;

//     } catch (error) {
//         console.log(error.response.data);
//     }
//     res.status(200).render(`${dir}/hospitallist`);
// }

// module.exports.viewDonor= async(req,res)=>{
//     try {
//         const result = await axios({
//             url:`${process.env.URL}/api/Organ`,
//             method:'GET'
//         });
        
//         let donors= [];
//         const donorPromise = result.data.map(async(donor)=>{
//             const donorDetails= await axios({
//                 url:`${process.env.URL}/api/Donor/${donor.donor.split("#")[1]}`,
//                 method:'GET'
//             });
//             donor.donor = donorDetails.data;
//             donors.push(donor);
//         });

//         await Promise.all(donorPromise);
//         console.log(donors);
//         res.locals.donorDetails = donors;
//     } catch (error) {
//         console.log(error);
//     }
    
//     res.status(200).render(`${dir}/donorList`);
// }

// module.exports.viewReciver=async (req,res)=>{
//     try {
//         const result = await axios({
//             url:`${process.env.URL}/api/Recipient`,
//             method:'GET'
//         });
        
//     const allrecieverlists=[];

//     result.data.forEach((reciever)=>{
//           allrecieverlists.push(reciever);    
//     });
//     res.locals.allrecieverLists = allrecieverlists;
        
//     } catch (error) {
//         console.log(error.response);
//     }
//     res.status(200).render(`${dir}/reciverList`);
// }

// module.exports.transplantHistory=(req,res)=>{
//     res.status(200).render(`${dir}/transplantHistory`);
// }

// module.exports.createhospital = async (req,res)=>{
//     console.log(req.body);
//     const password = req.body.password;
//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(password, salt);
//     req.body.password= hashed;
//     req.body.hospitalId = req.body.emailId;
//     delete req.body.confirmpassword;
//     req.body.role = "hospital";
//     try {
//         const result = await axios({
//             url:`${process.env.URL}/api/Hospital`,
//             method:'POST',
//             data: req.body,
//             json:true,
//             headers:{
//                 'Content-Type':'application/json'
//             }
//         }); 
//         const responseData = result.data;
//         if(result.status === 200){      
//                 alertify.alert("Hospital account created successfully");
//                 return res.redirect('http://localhost:8000/hotc/createHospital');
//             } 
//     } 
//     catch (error) {
//         if(error.response.data.error.message.includes("the object already exists")){
//             alert("Email already in use");
//             return res.redirect('http://localhost:8000/hotc/createHospital');
//         }
//         alert("Something went wrong");
//         return res.redirect('http://localhost:8000/hotc/createHospital');
//     }
// }

// module.exports.matched = async(req,res)=>{
//     const details = {
//         hospital :JSON.parse(req.body.reciever).hospital.split("#")[1],
//         recipient :JSON.parse(req.body.reciever).personId,
//         organ : JSON.parse(req.body.donor).organId,
//     }
//     try {
//         const result = await axios({
//             url:`${process.env.URL}/api/Matched`,
//             method:'POST',
//             data:details,
//             json:true,
//             headers:{
//                 'Content-Type':'application/json'
//             }
//         });
//         if(result.status === 200){
//             const result = await axios({
//                 url:`${process.env.URL}/api/Recipient/${JSON.parse(req.body.reciever).personId}`,
//                 method:'GET',
//             });
//             result.data.allocatedOrgan = `${JSON.parse(req.body.donor).organId}`

//             const updateResult = await axios({
//                 url:`${process.env.URL}/api/Recipient/${JSON.parse(req.body.reciever).personId}`,
//                 method:'PUT',
//                 data: result.data,
//                 json:true,
//                 headers:{
//                     'Content-Type':'application/json'
//                 },
//             });
//             if(updateResult.status === 200)
//             res.status(200).redirect("http://localhost:8000/hotc/matchlist");
//             console.log(updateResult.data);
//             console.log("success");
//         }

//     } catch (error) {
//         console.log(error.response);
//         res.status(200).redirect("http://localhost/hotc/match");
//     }
// }

// module.exports.getmatchList = async(req,res)=>{
//     try {
//         const result = await axios({
//             url:`${process.env.URL}/api/Organ`,
//             method:'GET',
//         });

//         const getorganlists= [];
//         const promise = result.data.map(async(element)=>{
//             if(element.status === "MATCHED"){
//                 const getdonor = await axios({
//                     url:`${process.env.URL}/api/Donor/${element.donor.split("#")[1]}`,
//                     method:'GET'
//                 });
//                 const getreceiver = await axios({
//                     url:`${process.env.URL}/api/Recipient/${element.recipient.split("#")[1]}`,
//                     method:'GET',
//                 });
//                 element.donor = getdonor.data;
//                 element.receiver = getreceiver.data;
//                 getorganlists.push(element);
//             }
//         });
//         await Promise.all(promise);
//         res.locals.organlists = getorganlists;
//     } catch (error) {
//       console.log(error.response);  
//     }
    
//     res.status(200).render(`${dir}/getmatchlist`);
// }



const path = require('path');
const dir = path.join(__dirname,"../views/hotc");
const bcrypt = require('bcryptjs');
const alertify = require('js-alert');
const axios = require('axios');

const url = require("../config/url");
const { portGenerator } = require('../helpers/helper');
const blockchainUrl = url.replace("$PORT", portGenerator("networkadmin"));

module.exports.hotcLogin=(req,res)=>{
    res.status(200).render('Login');
}

module.exports.createHospital=async(req,res)=>{
    res.status(200).render(`${dir}/createHospital`);
}

module.exports.getHotc=(req,res)=>{
    res.status(200).render(`${dir}/hotc`);
}

module.exports.matchList =async(req,res)=>{
    try {
        const result = await axios({
            url:`${blockchainUrl}/Organ`,
            method:'GET'
        });

        const recieverlists = [];
        const reciever = await axios({
            url:`${blockchainUrl}/Recipient`,
            method:'GET'
        });
        reciever.data.forEach((element)=>{
            recieverlists.push(element);
        });

        res.locals.recieverToRecieve = recieverlists;

        const donorsToDonate = [];

        const donorPromise = result.data.map(async(donor)=>{
            if(donor.status === "TESTED"){
                const donorToDonateDetails = await axios({
                    url:`${blockchainUrl}/Donor/${donor.donor.split("#")[1]}`,
                    method:'GET'
                });
                donor.donor = donorToDonateDetails.data;
                donorsToDonate.push(donor);
            }
        });
        await Promise.all(donorPromise);

        res.locals.donorToDonate = donorsToDonate;

    } catch (error) {
        console.log(error.response);    
    }
    res.status(200).render(`${dir}/match`);
}

module.exports.viewHospital=async(req,res)=>{
    console.log("GETTING HOSPITALS");
    try {
        const result = await axios({
            url:`${blockchainUrl}/Hospital`,
            method:'GET'
        });
        console.log(result.data);

        let hospitalLists= [];
        result.data.forEach((hospital)=>{
            hospitalLists.push(hospital);
        })
        res.locals.hospitallists = hospitalLists;
        res.status(200).render(`${dir}/hospitallist`);
    } catch (error) {
        // console.log(error);
        console.log(error.response.data);
    }
}

module.exports.viewDonor= async(req,res)=>{
    try {
        const result = await axios({
            url:`${blockchainUrl}/Organ`,
            method:'GET'
        });
        
        let donors= [];
        const donorPromise = result.data.map(async(donor)=>{
            const donorDetails= await axios({
                url:`${blockchainUrl}/Donor/${donor.donor.split("#")[1]}`,
                method:'GET'
            });
            donor.donor = donorDetails.data;
            donors.push(donor);
        });

        await Promise.all(donorPromise);
        console.log(donors);
        res.locals.donorDetails = donors;
    } catch (error) {
        console.log(error);
    }
    
    res.status(200).render(`${dir}/donorList`);
}

module.exports.viewReciver=async (req,res)=>{
    try {
        const result = await axios({
            url:`${blockchainUrl}/Recipient`,
            method:'GET'
        });
        
    const allrecieverlists=[];

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
            allrecieverlists.push(reciever);
        }
      });
      await Promise.all(RecieverPromise);

    res.locals.allrecieverLists = allrecieverlists;
        
    } catch (error) {
        console.log(error.response);
    }
    res.status(200).render(`${dir}/reciverList`);
}

module.exports.transplantHistory= async(req,res)=>{
  try {
    const result= await axios({
      url:`${blockchainUrl}/Organ`,
      method:'GET'
    });
    console.log(result.data);
  
  const transplantlists = [];
  const transplantpromise = result.data.map(async(element)=>{
      console.log("Inside");
    if(element.status === "TRANSPLANT"){
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
        console.log(transplantlists);
    }
  });
  await Promise.all(transplantpromise);
  res.locals.transplantLists = transplantlists;
  } catch (error) {
    console.log(error.response.data); 
  }
    res.status(200).render(`${dir}/transplantHistory`);
}

module.exports.createhospital = async (req,res)=>{
    console.log(req.body);
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    req.body.password= hashed;
    req.body.hospitalId = req.body.emailId;
    delete req.body.confirmpassword;
    req.body.role = "hospital";
    try {
        const result = await axios({
            url:`${blockchainUrl}/Hospital`,
            method:'POST',
            data: req.body,
            json:true,
            headers:{
                'Content-Type':'application/json'
            }
        });
        const responseData = result.data;
        if(result.status === 200){
            const spawn = require('child_process').spawn;
            const PORT = require("../config/port_mapping");
            const newPortMap = { port: PORT[PORT.length -1].port + 1, id: responseData.emailId };
            // PORT.push({ port: PORT[PORT.length -1].port + 1, id: responseData.emailId });
            // require("fs").writeFileSync("../config/port_mapping.js");
            PORT.push(newPortMap);
            try {

                const rest = spawn(`${__dirname}/generateRest.sh`, [responseData.name, responseData.emailId, newPortMap.port]);
                rest.stdout.on("data", data => {
                    console.log(`stdout: ${data}`);
                });
                
                rest.stderr.on("data", data => {
                    console.log(`stderr: ${data}`);
                });
                
                rest.on('error', (error) => {
                    console.log(`error: ${error.message}`);
                });
                
                rest.on("close", code => {
                    console.log(`child process exited with code ${code}`);
                });                
                alert("Hospital account created successfully");
                return res.redirect('http://localhost:8000/hotc/createHospital');

            } catch (error) {
                console.log("Someething went wrong!");
                console.log("ERROR: ", error);
                alertify.alert("Something went wrong");
            }
        }
    } 
    catch (error) {
        console.log(error);
        if(error.response.data.error.message.includes("the object already exists")){
            alertify.alert("Email already in use");
            return res.redirect('http://localhost:8000/hotc/createHospital');
        }
        alertify.alert("Something went wrong");
        return res.redirect('http://localhost:8000/hotc/createHospital');
    }
}

module.exports.matched = async(req,res) => {
    const details = {
        hospital :JSON.parse(req.body.reciever).hospital.split("#")[1],
        recipient :JSON.parse(req.body.reciever).personId,
        organ : JSON.parse(req.body.donor).organId,
    }
    try {
        const result = await axios({
            url:`${blockchainUrl}/Matched`,
            method:'POST',
            data:details,
            json:true,
            headers:{
                'Content-Type':'application/json'
            }
        });
        if(result.status === 200){
            const result = await axios({
                url:`${blockchainUrl}/Recipient/${JSON.parse(req.body.reciever).personId}`,
                method:'GET',
            });
            result.data.allocatedOrgan = `${JSON.parse(req.body.donor).organId}`

            const updateResult = await axios({
                url:`${blockchainUrl}/Recipient/${JSON.parse(req.body.reciever).personId}`,
                method:'PUT',
                data: result.data,
                json:true,
                headers:{
                    'Content-Type':'application/json'
                },
            });
            if(updateResult.status === 200)
            res.status(200).redirect("http://localhost:8000/hotc/matchlist");
            console.log(updateResult.data);
            console.log("success");
        }

    } catch (error) {
        console.log(error.response);
        res.status(200).redirect("http://localhost:8000/hotc/match");
    }
}

module.exports.getmatchList = async(req,res)=>{
    try {
        const result = await axios({
            url:`${blockchainUrl}/Organ`,
            method:'GET',
        });

        const getorganlists= [];
        const promise = result.data.map(async(element)=>{
            if(element.status === "MATCHED"){
                const getdonor = await axios({
                    url:`${blockchainUrl}/Donor/${element.donor.split("#")[1]}`,
                    method:'GET'
                });
                const getreceiver = await axios({
                    url:`${blockchainUrl}/Recipient/${element.recipient.split("#")[1]}`,
                    method:'GET',
                });
                element.donor = getdonor.data;
                element.receiver = getreceiver.data;
                getorganlists.push(element);
            }
        });
        await Promise.all(promise);
        res.locals.organlists = getorganlists;
    } catch (error) {
      console.log(error.response);  
    }
    
    res.status(200).render(`${dir}/getmatchlist`);
}


