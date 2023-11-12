import * as dbRtns from "./db_routines.js";
import * as cfg from "./config.js";
import moment from 'moment';
import { ObjectId } from "mongodb";

const resolvers = {
    getallusers: async () => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, cfg.usersCollection, {}, {});
    },
    getallprojects: async () => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, cfg.projectsCollection, {}, {});
    },
    getuser: async (args) => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findOne(db, cfg.usersCollection, { UniqueID: args });
    },
    getproject_users: async (args) => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, cfg.projects_usersCollection, { Project_id: ObjectId(args.Project_id) }, {});
    },
    getproject_tasks: async (args) => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, cfg.tasksCollection, { Project_id: ObjectId(args.Project_id) }, {});
    },
    adduser: async (args) => {
        let db = await dbRtns.getDBInstance();
        let user = {UniqueID: args.UniqueID,
            AccountID: args.AccountID,
            Password: args.Password,
            FirstName: args.FirstName,
            LastName: args.LastName,
            BirthDate: args.BirthDate,
            PhoneNumber: args.PhoneNumber,
            };
        let results = await dbRtns.addOne(db, cfg.usersCollection, user);
        return results.acknowledged ? user : null;  
    },
    addproject: async (args) => {
        let db = await dbRtns.getDBInstance();
        let project = {
            ProjectName: args.ProjectName,
            Stacks: args.Stacks,
            NumOfSprints: args.NumOfSprints,
            Description: args.Description,
            };
        let results = await dbRtns.addOne(db, cfg.projectsCollection, project);
        return results.acknowledged ? project : null;  
    },
    addproject_user: async (args) => {
        let db = await dbRtns.getDBInstance();
        let project_user = {
            Project_id: ObjectId(args.Project_id),
            User_id: ObjectId(args.User_id),
            };
        let results = await dbRtns.addOne(db, cfg.projects_usersCollection, project_user);
        return results.acknowledged ? project_user : null;  
    },
    deleteproject_user: async (args) => {
        let db = await dbRtns.getDBInstance();
        let results = await dbRtns.deleteOne(db, cfg.projects_usersCollection, { _id: ObjectId(args._id) });
        return results.acknowledged ? "DELETED" : null;
    },
    addtask: async (args) => {
        let db = await dbRtns.getDBInstance();
        let task = {
            Project_id: ObjectId(args.Project_id),
            TaskTitle: args.TaskTitle,
            EstimatedCost: args.EstimatedCost,
            ActualCost: args.ActualCost,
            Description: args.Description,
            SprintNumber: args.SprintNumber,
            AssigneeID : args.AssigneeID,
            Status: args.Status,
            TaskLog : args.TaskLog
            };
        let results = await dbRtns.addOne(db, cfg.tasksCollection, task);
        return results.acknowledged ? task : null;
    },
    updatetask: async (args) => {
        let db = await dbRtns.getDBInstance();
        let task = {
            Project_id: ObjectId(args.Project_id),
            TaskTitle: args.TaskTitle,
            EstimatedCost: args.EstimatedCost,
            ActualCost: args.ActualCost,
            Description: args.Description,
            SprintNumber: args.SprintNumber,
            AssigneeID : args.AssigneeID,
            Status: args.Status,
            TaskLog : args.TaskLog
            };
        let results = await dbRtns.updateOne(db, cfg.tasksCollection, { _id: ObjectId(args._id) }, task);
        return results.ok === 1 ? "UPDATED" : null;
    },
    deletetask: async (args) => {
        let db = await dbRtns.getDBInstance();
        let results = await dbRtns.deleteOne(db, cfg.tasksCollection, { _id: ObjectId(args._id) });
        return results.acknowledged ? "DELETED" : null;
    },
};
export { resolvers };