import React, { useReducer, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshake, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import { Routes, Route, NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { v4 as uuidv4 } from "uuid";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import { InputLabel, MenuItem, Select } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AdbIcon from '@mui/icons-material/Adb';
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FolderIcon from "@mui/icons-material/Folder";

import theme from "../theme";
import customFetch from "../utilities/utility";
import {
  Card,
  CardContent,
  Modal,
  TextField,
  Typography,
  Button,
} from "@mui/material";

import "../App.css";

import LoginComponent from "./LoginComponent";

const MainpageComponent = () => {
  const initialInfoState = {
    projects: [],
    users: [],
    numOfSprints: [],
    taskLogArray: [],
  };
  //State for showing table
  const [showTable, setShowTable] = useState([]);
  const [showList, setShowList] = useState([]);

  const [open, setOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [taskActionBtnDisabled, setTaskActionBtnDisabled] = useState(true);

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialInfoState);

  const [projectName, setProjectName] = useState("");
  const [stacks, setStacks] = useState("");
  const [numOfSprints, setNumOfSprints] = useState("");
  const [description, setDescription] = useState("");

  const [taskAction, setTaskAction] = useState("Add");
  const [taskModalTitle, setTaskModalTitle] = useState("Add Task");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskEstCost, setTaskEstCost] = useState("");
  const [taskActCost, setTaskActCost] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskSprintNumber, setTaskSprintNumber] = useState(0);
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskStatus, setTaskStatus] = useState("Ready");
  const [taskLog, setTaskLog] = useState("");

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectDetails, setSelectedProjectDetails] = useState({});
  const [selectedTask, setSelectedTask] = useState("");
  const [projectUsers, setProjectUsers] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);

  useEffect(() => {
    LoadProjectList();
    LoadUserList();
    if (projectName !== "" && Number.isInteger(parseInt(numOfSprints))) {
      setSaveButtonDisabled(false);
    } else {
      setSaveButtonDisabled(true);
    }
  }, [projectName, numOfSprints]);

  //api call

  const LoadProjectList = async () => {
    try {
      let projects = [];
      let newProjects = [];
      //fetching data
      let response = await customFetch(
        "query { getallprojects {_id, ProjectName, Stacks, NumOfSprints, Description}}"
      );
      let json = await response.json();

      projects = json.data.getallprojects;

      projects.map((project) => {
        let newProject = {
          Key: project._id,
          ProjectName: project.ProjectName,
          Stacks: project.Stacks,
          NumOfSprints: project.NumOfSprints,
          Description: project.Description,
        };

        newProjects.push(newProject);
      });

      if (newProjects.length > 0) {
        setShowTable(true);
      }

      setState({
        projects: newProjects,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const SaveProjectOnClick = async () => {
    try {
      //fetching data
      let response = await customFetch(`mutation { addproject 
            (ProjectName: "${projectName}", 
             Stacks : "${stacks}", 
             NumOfSprints: ${parseInt(numOfSprints)},
             Description: "${description}") 
            { ProjectName, Stacks, NumOfSprints, Description} 
          }`);

      setProjectName("");
      setStacks("");
      setNumOfSprints("");
      setDescription("");

      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const LoadUserList = async () => {
    try {
      let users = [];
      let newUsers = [];
      //fetching data
      let response = await customFetch(
        "query { getallusers {_id, FirstName, LastName}}"
      );
      let json = await response.json();

      users = json.data.getallusers;

      users.map((user) => {
        let newUser = {
          Key: user._id,
          FirstName: user.FirstName,
          LastName: user.LastName,
        };

        newUsers.push(newUser);
      });

      if (newUsers.length > 0) {
        setShowList(true);
      }

      setState({
        users: newUsers,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const LoadProjectUserList = async (Project_id) => {
    try {
      let project_users = [];
      let newProject_users = [];
      //fetching data
      let response = await customFetch(
        `query { getproject_users(Project_id: "${Project_id}") {_id, Project_id, User_id}}`
      );
      let json = await response.json();

      project_users = json.data.getproject_users;

      project_users.map((pu) => {
        let newPu = {
          Key: pu._id,
          Project_id: pu.Project_id,
          User_id: pu.User_id,
        };

        newProject_users.push(newPu);
      });

      setProjectUsers(newProject_users);
    } catch (error) {
      console.log(error);
    }
  };

  const LoadProjectTaskList = async (Project_id) => {
    try {
      let tasks = [];
      let newTasks = [];
      //fetching data
      let response = await customFetch(
        `query { getproject_tasks(Project_id: "${Project_id}") {_id, Project_id, TaskTitle, EstimatedCost, ActualCost, Description, SprintNumber, AssigneeID, Status, TaskLog}}`
      );
      let json = await response.json();

      tasks = json.data.getproject_tasks;

      tasks.map((t) => {
        let newT = {
          Key: t._id,
          Project_id: t.Project_id,
          TaskTitle: t.TaskTitle,
          EstimatedCost: t.EstimatedCost,
          ActualCost: t.ActualCost,
          Description: t.Description,
          SprintNumber: t.SprintNumber,
          AssigneeID: t.AssigneeID,
          Status: t.Status,
          TaskLog: t.TaskLog,
        };

        newTasks.push(newT);
      });

      setProjectTasks(newTasks);
    } catch (error) {
      console.log(error);
    }
  };

  // OnChange functions
  const ProjectNameTextFieldOnChange = (e, value) => {
    setProjectName(e.target.value);
  };
  const StackTextFieldOnChange = (e, value) => {
    setStacks(e.target.value);
  };

  const NumOfSprintsTextFieldOnChange = (e, value) => {
    const input = e.target.value;

    if (!Number.isInteger(parseInt(input))) {
      // show toaster
      toast.error("Number of sprints must be an integer");
      setNumOfSprints("");
      setSaveButtonDisabled(true);
      return;
    }

    setNumOfSprints(e.target.value);
  };

  const DesTextFieldOnChange = (e, value) => {
    setTaskTitle(e.target.value);
  };

  const taskTitletFieldOnChange = (e, value) => {
    setTaskTitle(e.target.value);
    setTaskActionBtnDisabled(false);
  };

  const taskEstCostTextFieldOnChange = (e, value) => {
    setTaskEstCost(e.target.value);
    setTaskActionBtnDisabled(false);
  };

  const taskActCostTextFieldOnChange = (e, value) => {
    setTaskActCost(e.target.value);
    setTaskActionBtnDisabled(false);
  };

  const taskSprintNumberTextFieldOnChange = (e, value) => {
    let number = e.target.value;

    if (number == undefined || number == "") {
      number = 0;
    }

    if (/^\d+$/.test(number) && parseInt(number) <= state.numOfSprints.length) {
      setTaskSprintNumber(number);
      setTaskActionBtnDisabled(false);
    } else {
      toast.error(
        "Please enter a valid integer value less than or equal to the number of sprints"
      );
    }
  };

  const taskStatusOnChange = (event, value) => {
    setTaskActionBtnDisabled(false);
    setTaskStatus(event.target.value);

    let userName = "";
    state.users.map((user) => {
      if (user.Key == taskAssignee) {
        userName += user.FirstName + " " + user.LastName;
      }
    });

    const now = new Date();
    const month = now.getMonth() + 1; // getMonth() returns 0-indexed month (0 = January)
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const formattedDate = `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    setTaskLog(
      `${taskLog}//${userName} changed status from ${event.target.value}                                       ${formattedDate}`
    );

    state.taskLogArray = taskLog.split("//");
  };

  const taskDesTextFieldOnChange = (e, value) => {
    setTaskDescription(e.target.value);
    setTaskActionBtnDisabled(false);
  };

  const handleRowClick = (project) => {
    //TODO -- render info in the middle Card
    setSelectedProject(project.Key);
    LoadProjectUserList(project.Key);
    LoadProjectTaskList(project.Key);
    setSelectedProjectDetails(project);

    let i = 1;
    let numSprints = project.NumOfSprints;
    let sprints = [];
    while (numSprints != 0) {
      sprints.push(i);
      i++;
      numSprints--;
    }

    setState({
      numOfSprints: sprints,
    });
  };

  const addTaskOnClick = (e, value) => {
    setSelectedTask("");
    setTaskModalTitle("Add Task");
    setTaskTitle("");
    setTaskEstCost("");
    setTaskActCost("");
    setTaskDescription("");
    setTaskSprintNumber("");
    setTaskAssignee("");
    setTaskStatus("");
    setTaskLog("");
    setTaskAction("ADD");
    setState({
      taskLogArray : []
    });
    setTaskActionBtnDisabled(true);
    taskModalOnOpen();
  };

  const modTaskOnClick = (task) => () => {
    setSelectedTask(task.Key);
    setTaskModalTitle("Update Task");
    setTaskTitle(task.TaskTitle);
    setTaskEstCost(task.EstimatedCost);
    setTaskActCost(task.ActualCost);
    setTaskDescription(task.Description);
    setTaskSprintNumber(task.SprintNumber);
    setTaskAssignee(task.AssigneeID);
    setTaskStatus(task.Status);
    setTaskLog(task.TaskLog);
    state.taskLogArray = task.TaskLog.split("//");
    setTaskAction("SAVE");
    setTaskActionBtnDisabled(true);
    taskModalOnOpen();
  };

  const handleTaskModalAction = async () => {
    taskModalOnClose();

    try {
      if (taskAction === "ADD") {
        let response = await customFetch(`
          mutation { addtask
            (Project_id: "${selectedProject}", 
             TaskTitle: "${taskTitle}",
             EstimatedCost: "${taskEstCost}"
             ActualCost: "${taskActCost}"
             Description: "${taskDescription}"
             SprintNumber: ${taskSprintNumber}
             AssigneeID : "${taskAssignee}"
             Status: "${taskStatus}"
             TaskLog: "${taskLog}") 
            { Project_id, TaskTitle, EstimatedCost, ActualCost, Description, SprintNumber, AssigneeID } 
          }`);

        console.log(response);
      } else if (taskAction === "SAVE") {
        let response = await customFetch(`
          mutation { updatetask
            (_id: "${selectedTask}"
             Project_id: "${selectedProject}", 
             TaskTitle: "${taskTitle}",
             EstimatedCost: "${taskEstCost}"
             ActualCost: "${taskActCost}"
             Description: "${taskDescription}"
             SprintNumber: ${taskSprintNumber}
             AssigneeID : "${taskAssignee}"
             Status: "${taskStatus}"
             TaskLog: "${taskLog}")
          }`);

        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }

    LoadProjectTaskList(selectedProject);
  };

  const deleteTaskOnClick = (task_id) => async () => {
    try {
      let response = await customFetch(
        `mutation { deletetask(_id: "${task_id}") }`
      );
    } catch (error) {
      console.log(error);
    }

    LoadProjectTaskList(selectedProject);
  };

  const handleToggle = (user_id) => async () => {
    const currentPu = projectUsers.find((pu) => pu.User_id === user_id);

    try {
      if (currentPu === undefined) {
        let response = await customFetch(`
          mutation { addproject_user 
            (Project_id: "${selectedProject}", 
             User_id : "${user_id}") 
            { Project_id, User_id } 
          }`);
      } else {
        let response = await customFetch(
          `mutation { deleteproject_user(_id: "${currentPu.Key}") }`
        );
      }
    } catch (error) {
      console.log(error);
    }

    LoadProjectUserList(selectedProject);
  };

  // UI Handlers
  const handleMouseEnterToPlusSign = () => {
    setIsHovered(true);
  };

  const handleMouseLeaveToPlusSign = () => {
    setIsHovered(false);
  };

  const projectAddModalOpen = () => {
    setOpen(true);
  };

  const projectAddModalClose = () => {
    setOpen(false);
  };

  const taskModalOnOpen = () => {
    setTaskModalOpen(true);
  };

  const taskModalOnClose = () => {
    setTaskModalOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="main-div">
        <Card
          className="left-card"
          style={{
            width: "15vw",
            height: "80vh",
            position: "absolute",
            left: 20,
            top: "5%",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CardContent>
            <Typography
              style={{
                position: "absolute",
                top: 10,
                left: 20,
                fontSize: 14,
                fontFamily: "Roboto, sans-serif",
                fontWeight: "bold",
                color: "#C0C0C0",
              }}
            >
              My projects
            </Typography>
            <FontAwesomeIcon
              icon={faPlus}
              style={{
                position: "absolute",
                top: 10,
                right: 15,
                cursor: "pointer",
                color: "#C0C0C0",
                transform: isHovered ? "rotate(135deg)" : "none",
                transition: "transform 0.2s ease-in-out",
              }}
              onClick={projectAddModalOpen}
              onMouseEnter={handleMouseEnterToPlusSign}
              onMouseLeave={handleMouseLeaveToPlusSign}
            />

            <br />
            {showTable && (
              <Table>
                <TableBody>
                  {state.projects.length > 0 &&
                    state.projects.map((project) => (
                      <TableRow
                        key={project.Key}
                        onClick={() => handleRowClick(project)}
                        hover={true}
                      >
                        <TableCell
                          style={{
                            fontSize: 12,
                            fontFamily: "Roboto, sans-serif",
                          }}
                        >
                          {project.ProjectName}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card
          className="main-card"
          style={{
            width: "65vw",
            height: "80vh",
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#F0EFEF",
            minWidth: 350,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <FontAwesomeIcon
            icon={faHandshake}          
            style={{
              color: theme.palette.primary.main,
              textAlign: "center",
              fontSize: 90,
              marginTop: 30,
            }}
          />
          <Paper sx={{ overflow: "auto", height: "100%" }}>
            {selectedProject !== "" && (             
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                <div style={{ padding: 20 }}>
                  <div style={{    
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'}}
                  >
                  <TextField
                      label="Project Name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={selectedProjectDetails.ProjectName}
                      onChange={ProjectNameTextFieldOnChange}
                  />
                  <TextField
                      label="Number of Sprints"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={selectedProjectDetails.NumOfSprints}
                      onChange={NumOfSprintsTextFieldOnChange}
                  />
                  <TextField
                      label="Stacks Used"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={selectedProjectDetails.Stacks}
                      onChange={StackTextFieldOnChange}
                  />
                  </div>
                  <TextField
                      label="Description"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={2}
                      margin="normal"
                      value={selectedProjectDetails.Description}
                      onChange={DesTextFieldOnChange}
                  />

                </div>
                <ListItem key={"add"} disablePadding>
                  <ListItemButton role={undefined} onClick={addTaskOnClick}>
                    <ListItemIcon>
                      <AddTaskIcon />
                    </ListItemIcon>
                    <ListItemText
                      id={"task-list-label-add"}
                      primary={"Add a new task..."}
                    />
                  </ListItemButton>
                </ListItem>
                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  <ListItem key={"backlog"}>
                    <ListItemIcon>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText
                      id={"task-list-label-backlog"}
                      primary={"Product Backlog"}
                    />
                  </ListItem>
                  {projectTasks.map((task) => {
                    const labelId = `task-list-label-${task.Key}`;
                    if (
                      task.SprintNumber == 0 ||
                      task.SprintNumber == undefined
                    ) {
                      return (
                        <ListItem
                          key={task.Key}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              aria-label="deletes"
                              onClick={deleteTaskOnClick(task.Key)}
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          }
                          disablePadding
                        >
                          <ListItemButton
                            role={undefined}
                            onClick={modTaskOnClick(task)}
                            sx={{
                              pl: 8,
                              borderBottom: 1,
                              borderColor: "lightgray",
                            }}
                          >
                            <ListItemIcon>
                              {task.Status == "Closed" ? (
                                <AssignmentTurnedInIcon />
                              ) : task.Status == "Testing" ? (
                                <AdbIcon />
                              ) : task.Status == "Development" ? (
                                <AssignmentIndIcon />
                              ) : (
                                <AssignmentIcon />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              id={labelId}
                              primary={`${task.TaskTitle}`}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    }
                  })}
                </List>

                {state.numOfSprints.map((num) => {
                  return (
                    <List
                      id={num}
                      sx={{ width: "100%", bgcolor: "background.paper" }}
                    >
                      <ListItem key={`sprint${num}`}>
                        <ListItemIcon>
                          <FolderIcon />
                        </ListItemIcon>
                        <ListItemText
                          id={`task-list-label-sprint${num}`}
                          primary={`Sprint ${num}`}
                        />
                      </ListItem>
                      {projectTasks.map((task) => {
                        const labelId = `task-list-label-${
                          task.Key + `sprint${num}`
                        }`;
                        if (task.SprintNumber == num) {
                          return (
                            <ListItem
                              key={task.Key + `sprint${num}`}
                              secondaryAction={
                                <IconButton
                                  edge="end"
                                  aria-label="deletes"
                                  onClick={deleteTaskOnClick(task.Key)}
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                              }
                              disablePadding
                            >
                              <ListItemButton
                                role={undefined}
                                onClick={modTaskOnClick(task)}
                                sx={{
                                  pl: 8,
                                  borderBottom: 1,
                                  borderColor: "lightgray",
                                }}
                              >
                                <ListItemIcon>
                                  {task.Status == "Closed" ? (
                                    <AssignmentTurnedInIcon />
                                  ) : task.Status == "Testing" ? (
                                    <AdbIcon />
                                  ) : task.Status == "Development" ? (
                                    <AssignmentIndIcon />
                                  ) : (
                                    <AssignmentIcon />
                                  )}
                                </ListItemIcon>
                                <ListItemText
                                  id={labelId}
                                  primary={`${task.TaskTitle}`}
                                />

                                <Typography
                                  sx={{ textAlign: "left", fontSize: 10 }}
                                >
                                  Estimated hours - {task.EstimatedCost}
                                </Typography>
                              </ListItemButton>
                            </ListItem>
                          );
                        }
                      })}
                    </List>
                  );
                })}
              </List>
            )}
          </Paper>
        </Card>

        <Card
          className="right-card"
          style={{
            width: "15vw",
            height: "80vh",
            position: "absolute",
            right: 20,
            top: "5%",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CardContent>
            <Typography
              style={{
                position: "absolute",
                top: 10,
                left: 20,
                fontSize: 14,
                fontFamily: "Roboto, sans-serif",
                fontWeight: "bold",
                color: "#C0C0C0",
              }}
            >
              Team Member List
            </Typography>
          </CardContent>
          {showList && selectedProject !== "" && (
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {state.users.map((user) => {
                const labelId = `checkbox-list-label-${user.Key}`;

                return (
                  <ListItem key={user.Key} disablePadding>
                    <ListItemButton
                      role={undefined}
                      onClick={handleToggle(user.Key)}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={
                            projectUsers.find(
                              (pu) => pu.User_id === user.Key
                            ) !== undefined
                          }
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={`${user.FirstName} ${user.LastName}`}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Card>
      </div>

      <Modal open={open} onClose={projectAddModalClose}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            height: "60%",
            border: "1px solid black",
            borderRadius: 5,
            backgroundColor: "white",
            overflow: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: theme.palette.primary.main,
              padding: "10px",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                fontWeight: "bold",
                fontSize: 30,
                color: "white",
                marginRight: 10,
                paddingLeft: 15,
              }}
            >
              Add Project
            </Typography>
          </div>

          <div style={{ padding: 20 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextField
                label="Project Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={projectName}
                onChange={ProjectNameTextFieldOnChange}
              />
              <TextField
                label="Number of Sprints"
                variant="outlined"
                fullWidth
                margin="normal"
                value={numOfSprints}
                onChange={NumOfSprintsTextFieldOnChange}
              />
              <TextField
                label="Stacks Used"
                variant="outlined"
                fullWidth
                margin="normal"
                value={stacks}
                onChange={StackTextFieldOnChange}
              />
            </div>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={11}
              margin="normal"
              value={description}
              onChange={DesTextFieldOnChange}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{
              position: "absolute",
              width: 88,
              bottom: 10,
              right: 127,
            }}
            disabled={saveButtonDisabled}
            onClick={SaveProjectOnClick}
          >
            SAVE
          </Button>
          <Button
            variant="contained"
            color="error"
            style={{
              position: "absolute",
              bottom: 10,
              right: 20,
            }}
            onClick={projectAddModalClose}
          >
            CLOSE
          </Button>
          <div>
            <ToastContainer />
          </div>
        </div>
      </Modal>

      <Modal open={taskModalOpen} onClose={taskModalOnClose}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            height: "60%",
            border: "1px solid black",
            borderRadius: 5,
            backgroundColor: "white",
            overflow: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: theme.palette.primary.main,
              padding: "10px",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                fontWeight: "bold",
                fontSize: 30,
                color: "white",
                marginRight: 10,
                paddingLeft: 15,
              }}
            >
              {taskModalTitle}
            </Typography>
          </div>

          <div style={{ padding: 20 }}>
            <TextField
              label="Task"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={taskTitle}
              onChange={taskTitletFieldOnChange}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextField
                label="Estimated time cost(hours)"
                variant="outlined"
                sx={{ width: "19%" }}
                margin="normal"
                value={taskEstCost}
                onChange={taskEstCostTextFieldOnChange}
              />
              <TextField
                label="Actual time cost(hours)"
                variant="outlined"
                sx={{ width: "19%" }}
                margin="normal"
                value={taskActCost}
                onChange={taskActCostTextFieldOnChange}
              />

              <TextField
                label="Assigned Sprint"
                variant="outlined"
                sx={{ width: "19%" }}
                margin="normal"
                value={taskSprintNumber}
                onChange={taskSprintNumberTextFieldOnChange}
              />

              <Select
                label="Assigned Sprint"
                variant="outlined"
                sx={{ width: "19%" }}
                margin="normal"
                value={taskAssignee}
                onChange={(event) => {
                  setTaskAssignee(event.target.value);
                  setTaskActionBtnDisabled(false);
                }}
              >
                {projectUsers
                  .filter((projectUser) =>
                    state.users.some((user) => projectUser.User_id === user.Key)
                  )
                  .map((projectUser) => {
                    const user = state.users.find(
                      (user) => user.Key === projectUser.User_id
                    );
                    return (
                      <MenuItem
                        key={projectUser.User_id}
                        value={projectUser.User_id}
                      >
                        {user.FirstName} {user.LastName}
                      </MenuItem>
                    );
                  })}
              </Select>

              <Select
                label="Status"
                variant="outlined"
                sx={{ width: "19%" }}
                margin="normal"
                value={taskStatus}
                onChange={taskStatusOnChange}
              >
                <MenuItem key="Ready" value="Ready">
                  Ready
                </MenuItem>
                <MenuItem key="Development" value="Development">
                  Development
                </MenuItem>
                <MenuItem key="Testing" value="Testing">
                  Testing
                </MenuItem>
                <MenuItem key="Closed" value="Closed">
                  Closed
                </MenuItem>
              </Select>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextField
                label="Description"
                variant="outlined"
                sx={{ width: "50%" }}
                multiline
                rows={7}
                margin="normal"
                value={taskDescription}
                onChange={taskDesTextFieldOnChange}
              />
              <Typography
                sx={{
                  width: "50%",
                  textAlign: "initial",
                  verticalAlign: "top",
                  overflow: "auto",
                  maxHeight: "12em",
                }}
              >
                {state.taskLogArray.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </Typography>
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{
              position: "absolute",
              width: 88,
              bottom: 10,
              right: 127,
            }}
            onClick={handleTaskModalAction}
            disabled={taskActionBtnDisabled}
          >
            {taskAction}
          </Button>
          <Button
            variant="contained"
            color="error"
            style={{
              position: "absolute",
              bottom: 10,
              right: 20,
            }}
            onClick={taskModalOnClose}
          >
            CLOSE
          </Button>
          <div>
            <ToastContainer />
          </div>
        </div>
      </Modal>

      <Routes>
        <Route path="/login" element={<LoginComponent />} />
      </Routes>
    </ThemeProvider>
  );
};
export default MainpageComponent;
