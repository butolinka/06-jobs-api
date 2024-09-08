const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../errors');


const getAllJobs = async (req, res)=>{
    const jobs = await Job.find({createdBy:req.user.userID}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count:jobs.length});
};
const getJob = async (req, res)=>{
    const {
        user:{userID}, 
        params:{id:jobId}
    } = req
    const job = await Job.findOne({
        _id: jobId, createdBy:userID
    });
    if(!job){
        throw new NotFoundError(`There is no job with ID ${jobId}`);
    }
    res.status(StatusCodes.OK).json({job});
};
const createJob = async (req, res)=>{
    req.body.createdBy = req.user.userID;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
};
const updateJob = async (req, res)=>{
    const {
    body:{company, position},
    user:{userID},
    params:{id:jobId}
    } = req

    if(company==='' || position===''){
        throw new BadRequestError("Please, provide company and position");
    }
    const job = await Job.findByIdAndUpdate({_id: jobId, createdBy:userID}, req.body, {new:true, runValidators:true});
    if(!job){
        throw new NotFoundError(`There is no job with ID ${jobId}`);
    }
    res.status(StatusCodes.OK).json({job});
};
const deleteJob = async (req, res)=>{
    const {
        user:{userID}, 
        params:{id:jobId}
    } = req
    const job = await Job.findOneAndDelete({_id: jobId, createdBy:userID});
    if(!job){
        throw new NotFoundError(`There is no job with ID ${jobId}`);
    }
    res.status(StatusCodes.OK).json({ msg: "The entry was deleted." });
};



module.exports = {getAllJobs, getJob, createJob, updateJob, deleteJob};