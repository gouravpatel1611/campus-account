import { Myclass } from "../models/class.model.js";
import {Staff} from "../models/staff.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";





const createClass = asyncHandler(async (req,res) =>{
    //get data from req
    //check authraization 
    //create department 
    // return department
    const {
        name,
        classNum,
        sec,
        year,
        isActive,
        desc,
        classTeacher,
    } = req.body
    console.log("this run",req.body)
    if(!(name && classNum && sec && year )) throw new ApiError(499,"All Field is required !!")

    const isClassNameExist = await Myclass.findOne({name}).select("_id");
    if(isClassNameExist) throw new ApiError(409,"ClassName Alredy exist");

    if(classTeacher){
        const isStaffExist = await Staff.findById(classTeacher).select("_id")
        if(!isStaffExist) throw new ApiError(404,"Teacher dose not exist")
    }
    
    try {
        const myclass = await Myclass.create({
            name,
            classNum,
            sec,
            year,
            isActive,
            desc,
            classTeacher,
        })
        return res
        .status(200)
        .json(new ApiResponse(200,{myclass},"Class Created Successfully !!"))
    } catch (err) {
        throw new ApiError(500,err.message);
    }
})



const updateClassDesc = asyncHandler(async (req,res)=>{
    // get data from req
    // update data on database
    // return new data 
    const {
        classID,
        desc
    } = req.body

    if(!desc) throw new ApiError(499,"All fields are required !!");

    const myclass = await Myclass.findByIdAndUpdate(classID,{desc},{new:true})
    if(!myclass) throw new ApiError(404,"Class not found ");
    return res
        .status(200)
        .json(new ApiResponse(200,{myclass},"Class desc updated Successfully !!"))
})


const changeClassName = asyncHandler(async (req,res)=>{
    const {
        classID,
        newName
    } = req.body

    if(!newName) throw new ApiError(499,"All fields are required !!")

    const isClassNameExist = await Myclass.findOne({name:newName}).select("_id");
    if(isClassNameExist) throw new ApiError(409,"ClassName Alredy exist");

    const myclass = await Myclass.findByIdAndUpdate(classID,{name:newName},{new:true});
    if(!myclass) throw new ApiError(404,"Class not found !!");

    return res
    .status(200)
    .json(new ApiResponse(200,{myclass},"Class Name Changed Successfully !!"));
})


const chaneClassTeacher = asyncHandler(async (req,res)=>{
    const {
        classID,
        classTeacher
    } = req.body;
    if(!classTeacher) throw new ApiError(499,"All fields are required ")

    const staff = await Staff.findById(classTeacher);
    if(!staff) throw new ApiError(404,"Teacher dose not exist !!");

    const  myclass = await Myclass.findByIdAndUpdate(classID,{classTeacher:classTeacher},{new:true})
    if(!myclass) throw new ApiError(404,"Class Not found !!");
    
    return res
    .status(200)
    .json(new ApiResponse(200,{myclass},"class Teacher changed successfully !!"))
})



const deactivetClass = asyncHandler(async (req,res)=>{
    const {
        classID
    } = req.body

    const  myclass = await Myclass.findByIdAndUpdate(classID,{isActive:false},{new:true})
    if(!myclass) throw new ApiError(404,"Class Not found !!");
    
    return res
    .status(200)
    .json(new ApiResponse(200,{myclass},"class Deactivet successfully !!"))

})



const getAllClass = asyncHandler(async (_,res)=>{
    const myclass =  await Myclass.aggregate([
        {
            $lookup: {
                from:"staffs",
                localField: "classTeacher",
                foreignField:"_id",
                as: "fullName",
            }
        },
        {
            $addFields: {
                "classTeacherFullName": {
                    $concat:[
                        {$first:"$fullName.firstName"},
                        " ",
                        {$first:"$fullName.midName"},
                        " ",
                        {$last:"$fullName.lastName"},
                    ]
                }
              }
           
        },
        {
            $project: {
                "_id":1,
                "name":1,
                "classTeacherFullName":1,
                "isActive":1,
            }
        },
      

    ])

    return res
    .status(200)
    .json(new ApiResponse(200,myclass,"get all myclass"));
})


export {
    createClass,
    updateClassDesc,
    changeClassName,
    chaneClassTeacher,
    deactivetClass,
    getAllClass,

}