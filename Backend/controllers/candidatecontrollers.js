const express = require('express');
const Candidate = require('../models/candidate');
const User = require('../models/user');

const checkadminrole = async (userID) => {
    try {
        const user = await User.findOne({ _id: userID });
        return user && user.role == "admin";
    } catch (err) {
        return false;
    }
};

const Addcandidate = async (req, res) => {
    try {
        const isAdmin = await checkadminrole(req.user.id);
        if (!isAdmin) {
            return res.status(403).json({ message: 'User is not a admin' });
        }

        const data = req.body;
        const newcandidate = new Candidate(data);
        const response = await newcandidate.save();
        console.log("data saved", response);
        res.status(200).json({ response: response });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const Updatecandidate = async (req, res) => {
    try {
        console.log("Request user:", req.user);
        const isAdmin = await checkadminrole(req.user.id);
        if (!isAdmin) {
            console.log("User is not a admin")
            return res.status(403).json({ message: 'User is not a admin' });
        }

        const candidateId = req.params.candidateId;
        const updateddata = req.body;

        console.log("Updating candidate:", candidateId, "with data:", updateddata);

        const response = await Candidate.findByIdAndUpdate(
            candidateId,
            updateddata,
            {
                new: true,
                runValidators: true
            }
        );

        if (!response) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        console.log(response)

        res.status(200).json({ response: response });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: 'Internal error' });
    }
};


const Deletcandidate = async (req, res) => {
    try {
        const isAdmin = await checkadminrole(req.user.id);
        if (!isAdmin) {
            return res.status(403).json({ message: 'User is not a admin' });
        }
        const candidateId = req.params.candidateId;

        const response = await Candidate.findByIdAndDelete(candidateId);


        return res.status(200).json({
            response:
                response, message: 'candidate delet succesfully'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal error' });
    }


}


//  This routes are for doing vote and get all candidates of theri party named and total votes
// Admin can't vote

const getallcandidate = async(req,res)=>{
    try{
        const candidates = await Candidate.find().select('name party voteCount');
        res.status(200).json({success:true,candidates})
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal server error'})
    }
}



const doingvote = async (req, res) => {
    const candidateId = req.params.candidateId;
    const userId = req.user.id;
    try {

        const isAdmin = await checkadminrole(userId);
        if (isAdmin) {
            return res.status(403).json({ message: 'admins are not allowed to vote' });
        }
        const user = await User.findById(userId);
        if (user.isvoted) {
            return res.status(400).json({ message: "User is already voted" });
        }

        const candidate =await Candidate.findById(candidateId);
        if(!candidate){
            return res.status(404).json({message:"Candidate not found"});
        }
        // push vote to candidate
        candidate.votes.push({user:userId});
        candidate.voteCount +=1;
        user.isvoted = true;
        await candidate.save()
        await user.save();
        console.log(candidateId);
        console.log(userId)

        res.status(200).json({ message: 'Vote submitted succesfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' })
    }

}



module.exports = { Addcandidate, Updatecandidate, Deletcandidate,getallcandidate ,doingvote};
