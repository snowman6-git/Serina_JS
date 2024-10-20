import discord
import json
import os
import asyncio
from discord.ext import commands
from discord import app_commands
from lib import tools

COGS_FOLDER = os.path.join(os.path.dirname(__file__), "cogs")  #__file__ < 현재 파이썬 파일
bot = commands.Bot(command_prefix="!", intents=discord.Intents.all(), sync_command=True)
Admin = [412863872127729687]
with open('token.json', 'r') as file: 
    token = json.load(file)['token']

@bot.event
async def on_ready():
    # 한번만 동기화 (안되면 빼샘)
    if not hasattr(bot, 'synced'):
        await bot.tree.sync()
        bot.synced = True
    print(f"{bot.user.name} is ready!")

@bot.tree.command(name="addons", description="modify addons")
@app_commands.choices(action=[
    app_commands.Choice(name="reload", value="reload"),
    app_commands.Choice(name="load", value="load"),
    app_commands.Choice(name="unload", value="unload"),
])
async def addons(interaction: discord.Interaction, action: app_commands.Choice[str]):
    # 관리자 X => 출력
    if interaction.user.id not in Admin:
        await interaction.response.send_message("봇 제작자 이외에는 접근할 수 없어요. 문제가 생겼다면 따로 연락해주세요", ephemeral=True)
        return
    
    # UI생성
    DView = discord.ui.View()
    select = discord.ui.Select(placeholder="애드온을 선택하세요")
    
    # 애드온 목록을 계속 불러오기
    addons = tools.addon_list()
    
    # enumerate 반복문 최적화
    for i, addon in enumerate(addons):
        select.add_option(label=f"{addon}", value=str(i))
    
    DView.add_item(select)

    async def addons_select(interaction: discord.Interaction):
        addon = addons[int(select.values[0])]
        cogs = tools.Cogs(bot)
        result = ""

        # action 따라 결과처리
        if action.value == "reload":
            result = await cogs.reload(addon)
        elif action.value == "load":
            result = await cogs.load(addon)
        elif action.value == "unload":
            result = await cogs.unload(addon)

        # 응답,처리 처리
        await interaction.response.defer()  # 대기
        embed = discord.Embed(title=f"{addon}.{action.value}", description="")
        embed.add_field(name="결과", value=f"{result}", inline=False)
        await interaction.edit_original_response(content="", embed=embed, view=None)
        await bot.tree.sync()  # 명령어 동기화

    # 콜백 설정
    select.callback = addons_select
    await interaction.response.send_message("애드온 매니저 v1.0", view=DView, ephemeral=True)  # ephemeral=True 나만 보기

async def main():
    async with bot:
        print("\n" * 10)
        await tools.bootup(bot, COGS_FOLDER)
        await bot.start(token)

if __name__ == "__main__":
    asyncio.run(main())
