import discord, json, os, asyncio
from discord.ext import commands
from discord import app_commands
from lib import tools

COGS_FOLDER = os.path.join(os.path.dirname(__file__), "cogs") #__file__ < 현재 파이썬 파일
bot = commands.Bot(command_prefix="!", intents=discord.Intents.all(), sync_command=True)
Admin = [412863872127729687]
with open('token.json', 'r') as file: 
    token = json.load(file)['token']

@bot.event
async def on_ready():
    await bot.tree.sync()
    print(f"{bot.user.name} is ready!")


@bot.tree.command(name="addons", description="modify addons") #관리만 가능하게 바꿀것
@app_commands.choices(action=[
    app_commands.Choice(name="reload", value="reload"),
    app_commands.Choice(name="load", value="load"),
    app_commands.Choice(name="unload", value="unload"),
])
async def addons(interaction, action: app_commands.Choice[str]):
    if not interaction.user.id in Admin:
        await interaction.response.send_message("봇 제작자 이외에는 접근할수없어요. 문제가 생겼다면 따로 연락해주세요")
        return None
    DView = discord.ui.View()
    select = discord.ui.Select(placeholder="애드온을 선택하세요")
    addons = tools.addon_list()
    for i in range(len(addons)):
        select.add_option(label=f"{addons[i]}", value=i)
    DView.add_item(select)
    await interaction.response.send_message("애드온 매니저 v1.0", view=DView, ephemeral=True) #ephemeral=True 나만보기
    async def addons_select(interaction: discord.Interaction):
        addon = addons[int(select.values[0])]
        cogs = tools.Cogs(bot)
        if action.value == "reload":
            result = await cogs.reload(addon)
        if action.value == "load":
            result = await cogs.load(addon)
        if action.value == "unload":
            result = await cogs.unload(addon)
        await interaction.response.defer() #ok 응답
        embed = discord.Embed(title=f"{addon}.{action.value}", description="")
        embed.add_field(name="결과", value=f"{result}", inline=False)
        await interaction.edit_original_response(content="", embed=embed, view=None)
        await bot.tree.sync()

    select.callback=addons_select



async def main():
    async with bot:
        print("\n"*10)
        await tools.bootup(bot, COGS_FOLDER)
        await bot.start(token) 

if __name__ == "__main__":
    asyncio.run(main())