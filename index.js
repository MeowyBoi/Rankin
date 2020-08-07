// Varibles
const Discord = require('discord.js');

const roblox = require('noblox.js');

const client = new Discord.Client();

// Config Varibles
const token = 'NzQwOTIxOTUxMDk4MzcyMTM2.XywDVg.nNfDUJoq4-GxODaNMR-VAND0rGs'; // Bot's token here pls
const prefix = '!'; // da prefix
const cookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_F404687E50E4DE3FB879FE4BDC6EE5653EB7BB3DDDE83A2E5BD8540D2FC34EF2452220CC094E8184AA385BB097D9C5E6E4BBA4B06599DAB6866091B33C2D9C934139B673EA6895CA4759229F55ACD06141A5C091F4FE01CFCF80804AB5215A05CB34342BEA94A60E511656AA11EE6A37C88203193C0EC1AF704BAD34D3793882ACA89164A496D8B53B6465BAC515738A3D4D56CBF7BF6F297E1CF9643ECAD884D732BB44F35BAFA085DE587C8975F07BF899BE4CEA64AA73A9F4708DD440122C215D829747853A475A78C5229456D39B054E6190B91A5646B4947A1208E5A8FD075E655892EF329B63816CB311E34BE85BE31799ACC298EA00BDC657230F27E240AE4176EC6FE83BF369B91E9EE85955974204849CE8EE4D2D49B05A6E4B43D24691FE1B'; // ur cookie pls
const username = 'Name here'; // username of roblox bot
const password = 'ur password'; // password of roblox bot(dont worry I wont hack :>)
const groupid = 6091365; // Group Id Here
const maximumRank = 255; // Max rank the bot listens to
const command = 'rank'; // ur command Example:(setrank/rank/wotever u want)
const whitelistedRole = 'da role that can use da cmd' // da role in discord that can use da command

// Main script ( Do not edit) especially u elvis, Watchin yah kid >.>

async function cookieLogin() {
    try {
        await roblox.cookieLogin(cookie);
    } catch (err) {
        login();
        return console.log('There was an error while logging into the account with the cookie: ' + err + ' Attempting to login with username and password...');
    }
    return console.log('Logged in!');
}

async function login() {
    try {
        await roblox.login(username, password); // I know login sometimes throws a captcha, but that only happens when you spam it!
    } catch (err) {
        return console.log('There was an error while loggin in to the account with the username and password: ' + err);
    }
    return console.log('Logged in!');
}

function isCommand(command, message){
    var command = command.toLowerCase();
    var content = message.content.toLowerCase();
    return content.startsWith(prefix + command);
}

client.on('ready', async () => {
    await cookieLogin();
    client.user.setActivity('!rank', { type : "LISTENING"}).catch(console.error)
});

client.on('message', async message => {
    if(message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
    if(isCommand(command, message)) {
        if(!message.member.roles.cache.some(role =>[whitelistedRole].includes(role.name))) {
            return message.channel.send("You don't have permission to run this command!");
        }
        let username = args[1];
        if(!username) {
            return message.channel.send("Please insert a username!");
        }
        let id;
        try {
            id = await roblox.getIdFromUsername(username);
        } catch {
            return message.channel.send("This isn't a valid username!");
        }
        let rank = Number(args[2]);
        if(!rank) {
            return message.channel.send("Please insert a rank id to set the user to!");
        }
        let oldRankId = await roblox.getRankInGroup(groupid, id);
        if(oldRankId == 0) {
            return message.channel.send("This user isn't in the group!");
        }
        if(oldRankId >= maximumRank) {
            return message.channel.send("I can't manage this user!");
        }
        if(rank > maximumRank) {
            return message.channel.send("I can't rank that high!");
        }
        let oldRankName = await roblox.getRankNameInGroup(groupid, id);
        try {
            await roblox.setRank(groupid, id, rank);
        } catch (err) {
            return message.channel.send("There was an error while ranking this user: " + err);
        }
        return message.channel.send(`Success! You have ranked ${username} from ${oldRankName} (${oldRankId}) to ${await roblox.getRankNameInGroup(groupid, id)} (${await roblox.getRankInGroup(groupid, id)})!`);
    }
});

client.login(token);