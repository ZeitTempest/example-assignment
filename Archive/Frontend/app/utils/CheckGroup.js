import Axios from "axios"

async function checkGroup(username, groupname) {
  try {
    const response = await Axios.post("/group/user", { username, groupname })

    if (response.data.groups[0].group_name) {
      console.log(`Yes, ${username} is in ${response.data.groups[0].group_name}`)
      return true
    }
  } catch (e) {
    console.log(e)
    console.log(`No, ${username} is not in ${groupname}`)
    return false
  }
}

export default checkGroup
