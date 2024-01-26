// import React, { useEffect, useState, useContext } from "react"
// import Axios from "axios"
// import validator from "validator"
// import { validatePassword } from "../utils/ValidatePassword"
// import StateContext from "../StateContext"
// import Select from "react-select"

// function UserManagement() {
//   // import statecontext
//   const appState = useContext(StateContext)

//   // for users.map to generate individual rows for user table
//   // to improve "performance", function also gets data for groups that user is in
//   const [users, setUsers] = useState([])

//   async function fetchUsers() {
//     try {
//       const responseU = await Axios.get(`/users`)
//       setUsers(responseU.data.users)
//     } catch (e) {
//       console.log("There was a problem.")
//       console.log(e)
//     }
//   }

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   const styles = {
//     multiValue: (base, state) => {
//       return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base
//     },
//     multiValueLabel: (base, state) => {
//       return state.data.isFixed ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 } : base
//     },
//     multiValueRemove: (base, state) => {
//       return state.data.isFixed ? { ...base, display: "none" } : base
//     }
//   }

//   // for groups.map to generate all groups in database
//   const [groups, setGroups] = useState([])

//   async function fetchGroups() {
//     try {
//       const response = await Axios.get(`/groups`)
//       const processedData = []
//       response.data.groups.forEach(group => {
//         const existingUser = processedData.find(user => user.username === group.username)

//         if (existingUser) {
//           // If the user already exists, add the current group name to their list of groups
//           existingUser.group_name.push(group.group_name)
//         } else {
//           // If the user doesn't exist, create a new object for them and add their username and group name
//           processedData.push({
//             username: group.username,
//             group_name: [group.group_name]
//           })
//         }
//       })
//       const for_options = []

//       processedData.forEach(user => {
//         const options = []
//         user.group_name.forEach(group => {
//           options.push({
//             value: group,
//             label: group,
//             isFixed: group === "Admin" && appState.username === user.username
//           })
//         })
//         for_options.push({ username: user.username, groups: options })
//       })
//       setGroups(for_options)
//     } catch (e) {
//       console.log("There was a problem.")
//       console.log(e)
//     }
//   }

//   function defVal(user) {
//     console.log(groups)
//     const test = groups.find(item => item.username === user)
//     return test.groups
//   }

//   useEffect(() => {
//     fetchGroups()
//   }, [])

//   // for creating new group
//   const [c_groupname, setc_groupname] = useState("")

//   // function for create group button
//   async function handleCreateGroup() {
//     if (c_groupname !== "") {
//       try {
//         const response = await Axios.post("/group/create", { c_groupname })
//         if (response.data) {
//           console.log(response.data)
//           setc_groupname("")
//           fetchGroups()
//           fetchGroupUserIsIn()
//         }
//       } catch (e) {
//         console.log(e)
//         console.log("There was a problem.")
//       }
//     }
//   }

//   // for creating new users
//   const [c_username, setc_username] = useState("")
//   const [c_password, setc_password] = useState("")
//   const [c_email, setc_email] = useState("")

//   // function for create user button
//   async function handleCreateUser() {
//     if (c_username !== "" && validatePassword(c_password) && validator.isEmail(c_email)) {
//       try {
//         const response = await Axios.post("/user/create", { c_username, c_password, c_email })
//         console.log(response.data)
//         if (response.data) {
//           console.log("User created")
//           setc_username("")
//           setc_password("")
//           setc_email("")
//           fetchUsers()
//         } else {
//           console.log("you are here")
//         }
//       } catch (e) {
//         console.log(e)
//         console.log({ c_username, c_password, c_email })
//         console.log("There was a problem.")
//       }
//     } else {
//       console.log("you have input username/pw incorrectly")
//     }
//   }

//   // function to update password
//   async function handleUpdatePassword(u_password, u_username) {
//     if (validatePassword(u_password)) {
//       try {
//         const response = await Axios.put("/user/update_password", { u_password, u_username })
//         if (response.data) {
//           console.log(`password is updated for ${u_username}`)
//           console.log(response.data)
//         } else {
//           console.log("backend did not respond well.")
//           console.log(response.data)
//         }
//       } catch (e) {
//         console.log(e)
//         console.log("something is wrong")
//       }
//     } else {
//       console.log("Password not updated")
//     }
//   }

//   // function to update email
//   async function handleUpdateEmail(u_email, u_username) {
//     if (validator.isEmail(u_email)) {
//       try {
//         const response = await Axios.put("/user/update_email", { u_email, u_username })
//         if (response.data) {
//           console.log(`email is updated for ${u_username}`)
//           console.log(response.data)
//         } else {
//           console.log("backend did not response well")
//           console.log(response.data)
//         }
//       } catch (e) {
//         console.log(e)
//         console.log("something is wrong")
//       }
//     } else {
//       console.log("Email not updated")
//     }
//   }

//   // function to update active status
//   async function handleUpdateActive(u_activestatus, u_username) {
//     try {
//       const response = await Axios.put("/user/update_activeStatus", { u_activestatus, u_username })

//       if (response.data) {
//         console.log(`status is updated to ${u_activestatus} for ${u_username}`)
//       } else {
//         console.log(`backend did not response well`)
//         console.log(response.data)
//       }
//     } catch (e) {
//       console.log(e)
//       console.log("something is wrong")
//     }
//   }

//   // function to add user to group
//   async function handleGroupSelect(u_group, u_username) {
//     try {
//       const response = await Axios.post("/group/add_user_to_group", { u_group, u_username })
//       if (response.data) {
//         console.log(response.data)
//       } else {
//         console.log(response.data)
//         console.log("There is something wrong.")
//       }
//     } catch (e) {
//       console.log(e)
//       console.log("something is wrong")
//     }
//   }

//   // function to remove user from group
//   async function handleGroupRemove(u_group, u_username) {
//     try {
//       const response = await Axios.post("/group/rmv_user_fr_group", { u_group, u_username })
//       if (response.data) {
//         console.log(response.data)
//       } else {
//         console.log(response.data)
//         console.log("something is wrong")
//       }
//     } catch (e) {
//       console.log(e)
//       console.log("something is wrong")
//     }
//   }

//   // function to handle action type in group select
//   function handleAction(a, change, u_username) {
//     if (change.action === "select-option") {
//       const u_group = change.option.value
//       handleGroupSelect(u_group, u_username)
//     } else if (change.action === "remove-value") {
//       const u_group = change.removedValue.value
//       handleGroupRemove(u_group, u_username)
//     } else {
//       console.log("something is wrong")
//     }
//   }

//   return (
//     <div>
//       <div className="align-items-center justify-content-center m-5">
//         <div className="d-flex">
//           <div>
//             {/* START create new user START */}
//             <h2 className="p-2">Create User</h2>
//             <div className="col-10">
//               <div className="input-group">
//                 <input onChange={e => setc_username(e.target.value)} value={c_username} placeholder="Username" name="username" type="text" className="form-control" />
//                 <input onChange={e => setc_password(e.target.value)} value={c_password} placeholder="Password" type="text" className="form-control" />
//                 <input onChange={e => setc_email(e.target.value)} value={c_email} placeholder="Email" type="text" className="form-control" />
//                 <button onClick={handleCreateUser} className="btn btn-primary" type="button">
//                   Create
//                 </button>
//               </div>
//             </div>
//             {/* END create new user END */}
//           </div>
//           <div>
//             <h2 className="p-2">Create Group</h2>
//             <div className="col-10">
//               <div className="input-group">
//                 <input onChange={e => setc_groupname(e.target.value)} value={c_groupname} placeholder="Group Name" type="text" className="form-control" />
//                 <button onClick={handleCreateGroup} className="btn btn-primary" type="button">
//                   Create
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="form-floating">
//             <select style={{ height: "140px" }} className="form-select" multiple aria-label="multiple select example">
//               {groups.map(group => {
//                 return <option key={group.value}>{group.value}</option>
//               })}
//             </select>
//             <label htmlFor="floatingTextarea2">Groups</label>
//           </div>
//         </div>
//         {/* <br /> */}
//         <hr className="rounded"></hr>
//         {/* <br /> */}
//         <div>
//           <h2 className="d-flex">
//             <div className="p-2">User Management</div>
//           </h2>
//         </div>
//         {/* START user management table START */}
//         <table id="userTable" className="table table-hover">
//           <thead>
//             <tr>
//               <th className="col-2" scope="col">
//                 Username
//               </th>
//               <th className="col-2" scope="col" data-editable="true">
//                 Password
//               </th>
//               <th className="col-2" scope="col">
//                 Email
//               </th>
//               <th className="col-auto" scope="col">
//                 Groups
//               </th>
//               <th className="col-sm-2" scope="col">
//                 Active Status
//               </th>
//               {/* <th scope="col">Update</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {users.map(user => {
//               return (
//                 <tr key={user.username}>
//                   {/* username here */}
//                   <td className="col-md-auto">
//                     <input className="form-control" type="text" value={user.username} readOnly disabled />
//                   </td>
//                   {/* password here */}
//                   <td className="col-sm">
//                     <div className="input-group mb-3">
//                       <input
//                         onBlur={e => {
//                           handleUpdatePassword(e.target.value, user.username), (e.target.value = "")
//                         }}
//                         type="password"
//                         className="form-control"
//                         placeholder="Password"
//                       />
//                     </div>
//                   </td>
//                   {/* email here */}
//                   <td className="col-md-auto">
//                     <div className="input-group mb-3">
//                       <input
//                         onBlur={e => {
//                           if (e.target.value !== user.email) {
//                             handleUpdateEmail(e.target.value, user.username)
//                           } else {
//                             console.log("No changes made, not sent.")
//                           }
//                         }}
//                         type="email"
//                         className="form-control"
//                         defaultValue={user.email}
//                       />
//                     </div>
//                   </td>
//                   {/* group here */}
//                   <td className="col-md-2">
//                     <Select
//                       styles={styles}
//                       isClearable={false}
//                       isMulti
//                       options={groups[0].groups}
//                       defaultValue={defVal(user.username)}
//                       placeholder="No Groups Assigned"
//                       onChange={(a, b) => {
//                         handleAction(a, b, user.username)
//                       }}
//                     />
//                   </td>
//                   {/* active status here */}
//                   <td style={{ paddingLeft: "30px", paddingTop: "15px" }}>
//                     <input
//                       onChange={e => {
//                         handleUpdateActive(e.target.checked, user.username)
//                       }}
//                       type="checkbox"
//                       defaultChecked={user.active_status}
//                       disabled={user.username === "admin0" || user.username === appState.username}
//                     />
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//         {/* END user management table END */}
//       </div>
//     </div>
//   )
// }

// export default UserManagement
