import os
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FFMPEG = r"C:\Users\moham\Downloads\ffmpeg-full\bin\ffmpeg.exe"
MUSIC = r"C:\Users\moham\Downloads\salaar bgm.mpeg"
FONT = r"C\:/Windows/Fonts/arialbd.ttf"

REELS = [
    {
        "id": "reel1",
        "title": "THE BIGGEST PROBLEM WITH EDUCATION",
        "hook": "ISN'T STUDENTS.",
        "beats": [
            (0, 7, "EVERY DAY HUMANITY DISCOVERS\nSOMETHING NEW."),
            (7, 15, "SO WHY ARE WE STILL\nLEARNING THE PAST?"),
            (15, 25, "SCHOOLS TEACH YESTERDAY.\nTHE UNIVERSE KEEPS CHANGING."),
            (25, 35, "WHAT IF EVERY DISCOVERY\nBECAME UNDERSTANDABLE?"),
            (35, 42, "SEE. UNDERSTAND.\nDISCOVER."),
            (42, 45, "DO NOT STUDY YESTERDAY.\nEXPLORE TOMORROW.\n\nFOLLOW SCILOOP."),
        ],
    },
    {
        "id": "reel2",
        "title": "HUMANITY DISCOVERS THOUSANDS",
        "hook": "WHY DOES ALMOST NOBODY KNOW?",
        "beats": [
            (0, 8, "HUMANITY DISCOVERS\nTHOUSANDS OF THINGS EVERY WEEK."),
            (8, 17, "NASA. NATURE. MIT.\nAI. MEDICINE. QUANTUM."),
            (17, 27, "THE SIGNAL MOVES FASTER\nTHAN EDUCATION CAN CATCH IT."),
            (27, 38, "WHAT IF DISCOVERIES\nCOULD EXPLAIN THEMSELVES?"),
            (38, 48, "SCILOOP CONNECTS THE SIGNAL\nTO A WORLD YOU CAN EXPLORE."),
        (48, 52, "DO NOT JUST HEAR THE NEWS.\nUNDERSTAND WHAT COMES NEXT.\n\nFOLLOW SCILOOP."),
        ],
    },
    {
        "id": "reel3",
        "title": "WHAT IF SCIENCE\nWORKED LIKE GOOGLE MAPS?",
        "hook": "ZOOM FROM ONE DISCOVERY\nTO THE WHOLE FUTURE.",
        "beats": [
            (0, 10, "WHAT IF YOU COULD EXPLORE\nEVERY SCIENTIFIC DISCOVERY?"),
            (10, 20, "ZOOM OUT: PHYSICS.\nBIOLOGY. AI. SPACE."),
            (20, 32, "FOLLOW THE CONNECTIONS\nBETWEEN IDEAS."),
            (32, 44, "OPEN A SIMULATION.\nCHANGE THE QUESTION."),
            (44, 54, "DISCOVERY TIMELINE.\nKNOWLEDGE GRAPH.\nFUTURE LEARNING."),
            (54, 60, "SCIENCE IS NOT A LIBRARY\nYOU FINISH.\n\nFOLLOW SCILOOP."),
        ],
    },
]


def esc(text: str) -> str:
    return text.replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'").replace(",", "\\,")


def render(reel):
    width, height, fps = 1080, 1920, 60
    duration = reel["beats"][-1][1]
    vf = [
        f"scale={int(width*1.12)}:{int(height*1.12)}",
        f"crop={width}:{height}:x='(iw-ow)/2+38*sin(t*.35)':y='(ih-oh)/2+28*cos(t*.28)'",
        "eq=brightness=-0.045:contrast=1.22:saturation=0.88",
        "noise=alls=8:allf=t+u",
        "vignette=PI/5",
        "drawbox=x=0:y=0:w=iw:h=ih:color=0x020611@0.28:t=fill",
        f"drawtext=fontfile='{FONT}':text='SCILOOP / FIRST LAUNCH':fontcolor=0x9FEAFF:fontsize=28:x=54:y=66:enable='gte(t\\,0)*lt(t\\,{duration})'",
    ]
    for index, (start, end, text) in enumerate(reel["beats"]):
        fade = "1"
        size = 76 if index not in (0, 5) else 66
        y = 720 if index != 5 else 650
        vf.append(f"drawbox=x=58:y=570:w=964:h=620:color=0x020611@.34:t=fill:enable='gte(t\\,{start})*lt(t\\,{end})'")
        vf.append(f"drawtext=fontfile='{FONT}':text='{esc(text)}':fontcolor=white:fontsize={size}:line_spacing=18:x=(w-text_w)/2:y={y}:alpha='{fade}':enable='gte(t\\,{start})*lt(t\\,{end})':shadowcolor=0x00C8FF@.8:shadowx=3:shadowy=0")
        vf.append(f"drawtext=fontfile='{FONT}':text='SCILOOP':fontcolor=0x8DEBFF:fontsize=34:x=(w-text_w)/2:y=1580:alpha='{fade}':enable='gte(t\\,{start})*lt(t\\,{end})'")
    vf.append("format=yuv420p")
    out_path = os.path.join(ROOT, "sciloop_first_launch", reel["id"], f"{reel['id']}_instagram_1080x1920.mp4")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    cmd = [FFMPEG, "-y", "-hide_banner", "-loglevel", "warning", "-f", "lavfi", "-i", f"color=c=0x071321:s={width}x{height}:r={fps}:d={duration}", "-stream_loop", "-1", "-i", MUSIC, "-filter_complex", f"[0:v]{','.join(vf)}[v];[1:a]atrim=duration={duration},afade=t=in:st=0:d=0.4,afade=t=out:st={max(0, duration-1)}:d=1,volume=.72,aresample=async=1[a]", "-map", "[v]", "-map", "[a]", "-t", str(duration), "-r", str(fps), "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out_path]
    subprocess.run(cmd, check=True)
    return out_path


if __name__ == "__main__":
    for reel in REELS:
        print(f"Rendering {reel['id']}...")
        print(render(reel))
