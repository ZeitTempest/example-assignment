import Axios from "axios"

async function checkGroup(username) {
  try {
    const response = await Axios.post("/group/checkadmin", { username })

    if (response.data.groups[0].group_name) {
      console.log(`Yes, ${username} is in Admin`)
      return true
    }
  } catch (e) {
    console.log(e)
    console.log(`No, ${username} is not Admin`)
    return false
  }
}

export default checkGroup
