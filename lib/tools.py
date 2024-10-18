import os

def cogs(bot, COGS_FOLDER):
    for filename in os.listdir(COGS_FOLDER):
        if filename.endswith(".py"):
            module = f"cogs.{filename[:-3]}"
            bot.load_extension(module)