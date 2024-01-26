const data = {
  groups: [
    {
      group_name: "Admin",
      username: ""
    },
    {
      group_name: "DT",
      username: ""
    },
    {
      group_name: "PL",
      username: ""
    },
    {
      group_name: "PM",
      username: ""
    },
    {
      group_name: "Users",
      username: ""
    },
    {
      group_name: "Admin",
      username: "admin"
    },
    {
      group_name: "DT",
      username: "admin"
    },
    {
      group_name: "PL",
      username: "admin"
    },
    {
      group_name: "PM",
      username: "admin"
    },
    {
      group_name: "Admin",
      username: "admin0"
    },
    {
      group_name: "PL",
      username: "admin0"
    },
    {
      group_name: "Admin",
      username: "admin1"
    },
    {
      group_name: "Admin",
      username: "admin2"
    },
    {
      group_name: "PL",
      username: "admin2"
    },
    {
      group_name: "Admin",
      username: "dev1"
    },
    {
      group_name: "Admin",
      username: "newuser"
    },
    {
      group_name: "DT",
      username: "newuser"
    },
    {
      group_name: "PL",
      username: "newuser"
    },
    {
      group_name: "PM",
      username: "newuser"
    },
    {
      group_name: "Users",
      username: "newuser"
    },
    {
      group_name: "Admin",
      username: "whoisthis"
    }
  ]
}

const processedData = []

data.groups.forEach(group => {
  const existingUser = processedData.find(user => user.username === group.username)

  if (existingUser) {
    // If the user already exists, add the current group name to their list of groups
    existingUser.group_name.push(group.group_name)
  } else {
    // If the user doesn't exist, create a new object for them and add their username and group name
    processedData.push({
      username: group.username,
      group_name: [group.group_name]
    })
  }
})

console.log(processedData[0].group_name)

const for_options = []

processedData.forEach(user => {
  const options = []
  user.group_name.forEach(group => {
    options.push({
      value: group,
      label: group,
      isFixed: true
    })
  })
  for_options.push({ username: user.username, groups: options })
})
