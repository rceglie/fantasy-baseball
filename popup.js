document.addEventListener('DOMContentLoaded', function(){
    var discordBtn = document.createElement("button")
    discordBtn.onclick = discordClicked
    discordBtn.textContent = "DISCORD"
    discordBtn.className="button-21"
    document.getElementById("discord-btn").appendChild(discordBtn)
})

function discordClicked(){
    open("https://discord.gg/ajBGsBpqrV")
}