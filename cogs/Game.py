from discord.ext import commands
from discord import app_commands
import discord, asyncio
from lib import tools
import os

ASSET_SOUNDS = os.path.join(os.path.dirname(__file__), "..", "assets/sounds")

class Game(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        

    @commands.Cog.listener()
    async def on_ready(self):
        await self.bot.tree.sync()
        # print(f'{self.bot.user}의 슬래시 커맨드가 동기화되었습니다.')

    @app_commands.command(name="사운드", description="사운드 테스트") #관리만 가능하게 바꿀것
    async def addons(self, interaction: discord.Interaction):
        embed = discord.Embed(title="사운드보드", description=f"")
        a = await interaction.response.send_message(embed=embed)

        sounds = os.listdir(ASSET_SOUNDS)
        await interaction.channel.send(sounds)


        DView = discord.ui.View()
        options = ["새로고침"]
        for i in range(len(options)):
            DView.add_item(discord.ui.Button(style=discord.ButtonStyle.gray, label=options[i], custom_id=options[i]))
        for i in range(len(sounds)): #사운드 리스트에서 하나씩 리턴함
            button = discord.ui.Button(style=discord.ButtonStyle.gray, label=f"{i+1}: {sounds[i]}", value=str(i))#, emoji=bt_list[i])
            try: DView.add_item(button)
            except ValueError:
                print("밸류 에러")
        await a.edit(view=DView)
        while True:
            try:
                interaction: discord.Interaction = await self.bot.wait_for(
                    "interaction",
                    check=lambda interaction: interaction.message.id == a.id,
                    timeout=None
                )
                await interaction.response.defer()
                try: 
                    channel = interaction.user.voice.channel
                    voice=await channel.connect()
                except: pass
                if not interaction.data["custom_id"].isalpha():
                    if voice.is_playing(): voice.stop()
                    target = ASSET_SOUNDS[int(interaction.data["custom_id"])]
                    try: voice.play(discord.FFmpegPCMAudio(source=f"./sounds/{target}"))
                    except: pass
            except asyncio.TimeoutError:
                pass
        
        # DView = discord.ui.View()
        # select = discord.ui.Select(placeholder="애드온을 선택하세요")
        # sounds = os.listdir(ASSET_SOUNDS)
        # for i in range(len(sounds)):
        #     select.add_option(label=f"{sounds[i]}", value=i)
        # DView.add_item(select)
    
        # await interaction.response.send_message("애드온 매니저 v1.0", view=DView) #ephemeral=True 나만보기
        # async def addons_select(interaction: discord.Interaction):
        #     sound = sounds[int(select.values[0])]
        #     channel = interaction.user.voice.channel
        #     try:
        #         voice=await channel.connect()
        #         voice.play(discord.FFmpegPCMAudio(source=f"{ASSET_SOUNDS}/{sound}"))
        #     except Exception as E: 
        #         print(E)
        #     finally: await interaction.response.defer() #ok 응답
            

            
        # select.callback=addons_select
    
    
    @app_commands.command(name="러시안룰렛", description="한명이 남을때까지 계속되는 살인게임")
    async def roulette(self, interaction: discord.Interaction):
        channel = interaction.user.voice.channel
        voice=await channel.connect()

        # if channel is None:
        #     voice=await channel.connect()
        # else: pass
        interaction.response.defer()
        try:
            for i in range(1, 3):
                voice.play(discord.FFmpegPCMAudio(source=f"{ASSET_SOUNDS}/bullet.mp3"))
                await asyncio.sleep(1)

            for i in range(1, 5):
                voice.play(discord.FFmpegPCMAudio(source=f"{ASSET_SOUNDS}/bullet.mp3"))
                await asyncio.sleep(0.5)
                
        except Exception as E:
            print(E)

# Cog 등록
async def setup(bot):
    await bot.add_cog(Game(bot))
