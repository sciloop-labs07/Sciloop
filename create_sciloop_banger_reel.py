import argparse
import os
import subprocess


ROOT = os.path.dirname(os.path.abspath(__file__))
SOURCE_VIDEO = r"C:\Users\moham\Downloads\reel  1.1.mp4"
SOURCE_AUDIO = r"C:\Users\moham\Downloads\salaar bgm.mpeg"
# Mid-song section selected from the strongest 8-second loudness windows.
MUSIC_START = "240"
FFMPEG = r"C:\Users\moham\Downloads\ffmpeg-full\bin\ffmpeg.exe"


def make_filter(w: int, h: int) -> str:
    font = r"C\:/Windows/Fonts/arialbd.ttf"
    # The source is already vertical. Dynamic crop drift and scale breathing make
    # repeated passes feel like different camera moves rather than a loop.
    vf = (
        f"scale=ceil({w}*(1.06+0.035*sin(1.7*t))):ceil({h}*(1.06+0.035*sin(1.7*t))):eval=frame,"
        f"crop={w}:{h}:(iw-{w})/2+{w}*0.035*sin(1.4*t):(ih-{h})/2+{h}*0.022*cos(1.1*t),"
        "fps=30,eq=brightness=-0.035:contrast=1.16:saturation=0.86,"
        "colorbalance=rs=-0.03:gs=0.01:bs=0.06:rm=-0.02:gm=0.00:bm=0.04,"
        "noise=alls=3:allf=t+u,vignette=PI/5:eval=frame,"
        "drawbox=x=0:y=0:w=iw:h=ih:color=0x020611@0.18:t=fill,"
        # Hook
        f"drawtext=fontfile='{font}':text='THE WAY WE UNDERSTAND':fontcolor=0xEAF7FF:fontsize={int(w*0.058)}:x=(w-text_w)/2:y={int(h*0.38)}:alpha='if(lt(t,0.45),0,if(lt(t,0.85),(t-0.45)/0.4,1))':enable='between(t,0.25,1.45)',"
        f"drawtext=fontfile='{font}':text='SCIENCE':fontcolor=0xFFFFFF:fontsize={int(w*0.112)}:x=(w-text_w)/2:y={int(h*0.425)}:alpha='if(lt(t,0.65),0,if(lt(t,1.0),(t-0.65)/0.35,1))':enable='between(t,0.55,1.75)',"
        f"drawtext=fontfile='{font}':text='IS ABOUT TO CHANGE.':fontcolor=0x7FE7FF:fontsize={int(w*0.073)}:x=(w-text_w)/2:y={int(h*0.55)}:alpha='if(lt(t,1.25),0,if(lt(t,1.55),(t-1.25)/0.3,1))':enable='between(t,1.15,2.15)',"
        # Reveal
        f"drawtext=fontfile='{font}':text='UNTIL NOW.':fontcolor=white:fontsize={int(w*0.082)}:x=(w-text_w)/2:y={int(h*0.76)}:alpha='if(lt(t,1.8),0,if(lt(t,2.05),(t-1.8)/0.25,1))':enable='between(t,1.7,2.55)',"
    )
    portals = [
        ("PHYSICS WORLD", 2.55), ("VISUAL LANGUAGE", 3.25), ("STUDENTS PORTAL", 3.95),
        ("LIVE SCIENCE NEWS", 4.65), ("MINI EXPERIMENT LAB", 5.35), ("SIMULATION LAB", 6.05),
        ("COSMIC SIMULATION", 6.75), ("TIMELESS PROBLEMS LAB", 7.45), ("POTENTIAL EXPLORER", 8.15),
        ("GLOBAL PROBLEM SOLVER", 8.85), ("IMPACT HUB", 9.55), ("KNOWLEDGE FRONTIER", 10.25),
    ]
    for i, (title, start) in enumerate(portals):
        end = start + 0.62
        color = "0xDDF8FF" if i % 3 else "0xFFFFFF"
        y = int(h * (0.43 + (i % 3) * 0.045))
        vf += (
            f"drawtext=fontfile='{font}':text='{title}':fontcolor={color}:fontsize={int(w*(0.052 if len(title)>17 else 0.066))}:"
            f"x=(w-text_w)/2:y={y}:shadowcolor=0x00A6D6@0.75:shadowx=3:shadowy=0:"
            f"alpha='if(lt(t,{start}),0,if(lt(t,{start+0.12}),(t-{start})/0.12,if(lt(t,{end-0.12}),1,({end}-t)/0.12)))':enable='between(t,{start},{end})',"
        )
    vf += (
        f"drawtext=fontfile='{font}':text='SEE.':fontcolor=white:fontsize={int(w*0.18)}:x=(w-text_w)/2:y={int(h*0.39)}:enable='between(t,11.05,11.75)',"
        f"drawtext=fontfile='{font}':text='UNDERSTAND.':fontcolor=0x9CEBFF:fontsize={int(w*0.115)}:x=(w-text_w)/2:y={int(h*0.44)}:enable='between(t,11.75,12.55)',"
        f"drawtext=fontfile='{font}':text='DISCOVER.':fontcolor=white:fontsize={int(w*0.145)}:x=(w-text_w)/2:y={int(h*0.48)}:enable='between(t,12.55,13.35)',"
        f"drawbox=x=0:y=0:w=iw:h=ih:color=0x020611@0.54:t=fill:enable='between(t,13.35,20.8)',"
        f"drawtext=fontfile='{font}':text='SCIENCE. WITHOUT LIMITS.':fontcolor=0xEAF7FF:fontsize={int(w*0.065)}:x=(w-text_w)/2:y={int(h*0.39)}:enable='between(t,14.0,17.2)',"
        f"drawtext=fontfile='{font}':text='SCILOOP':fontcolor=white:fontsize={int(w*0.145)}:x=(w-text_w)/2:y={int(h*0.48)}:shadowcolor=0x1EDBFF@0.8:shadowx=0:shadowy=0:enable='between(t,16.4,20.8)',"
        f"drawtext=fontfile='{font}':text='THE VISUAL OS FOR DISCOVERY':fontcolor=0x8AB8C9:fontsize={int(w*0.036)}:x=(w-text_w)/2:y={int(h*0.585)}:enable='between(t,17.1,20.8)',"
        "format=yuv420p"
    )
    return vf


def make_filter_advanced(w: int, h: int) -> str:
    font = r"C\:/Windows/Fonts/arialbd.ttf"
    # Build a true story arc from the 10-second source: equations -> awakening ->
    # cosmic reveal. Each source region is used once before the final hold.
    parts = [
        (0.0, 2.1), (2.1, 4.3), (4.3, 6.8), (6.8, 8.8),
        (8.8, 10.0), (0.0, 2.0), (8.0, 10.0),
    ]
    split = "[0:v]split=7" + "".join(f"[p{i}]" for i in range(7)) + ";"
    clips = []
    for i, (start, end) in enumerate(parts):
        extra = ",tpad=stop_mode=clone:stop_duration=7.0" if i == 6 else ""
        clips.append(f"[p{i}]trim=start={start}:end={end},setpts=PTS-STARTPTS{extra}[c{i}]")
    concat = ";".join(clips) + ";" + "".join(f"[c{i}]" for i in range(7)) + "concat=n=7:v=1:a=0[v0];"
    base = (
        f"[v0]scale={int(w*1.10)}:{int(h*1.10)},"
        f"crop={w}:{h}:(iw-{w})/2+{w}*0.025*sin(1.7*t):(ih-{h})/2+{h}*0.018*cos(1.3*t),"
        "fps=30,eq=brightness=-0.025:contrast=1.22:saturation=0.82,"
        "colorbalance=rs=-0.04:gs=0.01:bs=0.08:rm=-0.03:gm=0.00:bm=0.06,"
        "noise=alls=2:allf=t+u,vignette=PI/5:eval=frame,"
        "drawbox=x=0:y=0:w=iw:h=ih:color=0x020611@0.12:t=fill,"
        # Editorial framing and impact flashes.
        f"drawbox=x={int(w*.055)}:y={int(h*.08)}:w={int(w*.89)}:h=2:color=0x8CEBFF@0.30:t=fill,"
        f"drawbox=x={int(w*.055)}:y={int(h*.92)}:w={int(w*.89)}:h=2:color=0x8CEBFF@0.30:t=fill,"
        f"drawbox=x=0:y=0:w=iw:h=ih:color=white@0.34:t=fill:enable='between(t,2.05,2.13)+between(t,4.28,4.34)+between(t,10.02,10.10)+between(t,13.28,13.36)',"
        # Hook: high-contrast, minimal, centered.
        f"drawbox=x=0:y=0:w=iw:h=ih:color=0x020611@0.62:t=fill:enable='between(t,0,2.1)',"
        f"drawtext=fontfile='{font}':text='THE WAY WE UNDERSTAND':fontcolor=0xC9F5FF:fontsize={int(w*.050)}:x=(w-text_w)/2:y={int(h*.37)}:enable='between(t,.18,1.2)',"
        f"drawtext=fontfile='{font}':text='SCIENCE':fontcolor=white:fontsize={int(w*.13)}:x=(w-text_w)/2:y={int(h*.425)}:shadowcolor=0x00B7E6@.85:shadowx=3:shadowy=0:enable='between(t,.55,1.8)',"
        f"drawtext=fontfile='{font}':text='IS ABOUT TO CHANGE.':fontcolor=0x8DEBFF:fontsize={int(w*.063)}:x=(w-text_w)/2:y={int(h*.55)}:enable='between(t,1.22,2.1)',"
        # Reveal and portal chapter label.
        f"drawtext=fontfile='{font}':text='UNTIL NOW.':fontcolor=white:fontsize={int(w*.085)}:x=(w-text_w)/2:y={int(h*.77)}:enable='between(t,2.05,2.75)',"
        f"drawtext=fontfile='{font}':text='SCILOOP / THE DISCOVERY INTERFACE':fontcolor=0x9EDCF0:fontsize={int(w*.031)}:x={int(w*.07)}:y={int(h*.12)}:enable='between(t,2.7,13.3)',"
    )
    portals = [
        ("PHYSICS WORLD", 2.75, .62), ("VISUAL LANGUAGE", 3.40, .62), ("STUDENTS PORTAL", 4.05, .62),
        ("LIVE SCIENCE NEWS", 4.70, .62), ("MINI EXPERIMENT LAB", 5.35, .62), ("SIMULATION LAB", 6.00, .62),
        ("COSMIC SIMULATION", 6.65, .62), ("TIMELESS PROBLEMS LAB", 7.30, .62), ("POTENTIAL EXPLORER", 7.95, .62),
        ("GLOBAL PROBLEM SOLVER", 8.60, .62), ("IMPACT HUB", 9.25, .62), ("KNOWLEDGE FRONTIER", 9.90, .62),
    ]
    for i, (title, start, dur) in enumerate(portals):
        end = start + dur
        size = int(w * (0.048 if len(title) > 18 else 0.061))
        y = int(h * (0.42 + (i % 2) * 0.055))
        vf = f"drawtext=fontfile='{font}':text='{title}':fontcolor={('0xE7FBFF' if i%2 else 'white')}:fontsize={size}:x=(w-text_w)/2:y={y}:borderw=1:bordercolor=0x071A24@.85:shadowcolor=0x00C8FF@.75:shadowx=3:shadowy=0:enable='between(t,{start},{end})',"
        base += vf
    base += (
        # Core mantra lands as three separate hard cuts.
        f"drawtext=fontfile='{font}':text='SEE.':fontcolor=white:fontsize={int(w*.19)}:x=(w-text_w)/2:y={int(h*.40)}:enable='between(t,10.65,11.40)',"
        f"drawtext=fontfile='{font}':text='UNDERSTAND.':fontcolor=0xA8F1FF:fontsize={int(w*.115)}:x=(w-text_w)/2:y={int(h*.445)}:enable='between(t,11.40,12.20)',"
        f"drawtext=fontfile='{font}':text='DISCOVER.':fontcolor=white:fontsize={int(w*.155)}:x=(w-text_w)/2:y={int(h*.49)}:enable='between(t,12.20,13.30)',"
        # Quiet, premium close.
        f"drawbox=x=0:y=0:w=iw:h=ih:color=0x020611@.64:t=fill:enable='between(t,13.30,21)',"
        f"drawtext=fontfile='{font}':text='SCIENCE. WITHOUT LIMITS.':fontcolor=0xDDF8FF:fontsize={int(w*.061)}:x=(w-text_w)/2:y={int(h*.39)}:enable='between(t,13.70,16.9)',"
        f"drawtext=fontfile='{font}':text='SCILOOP':fontcolor=white:fontsize={int(w*.16)}:x=(w-text_w)/2:y={int(h*.48)}:shadowcolor=0x00D8FF@.85:shadowx=0:shadowy=0:enable='between(t,16.0,21)',"
        f"drawtext=fontfile='{font}':text='THE VISUAL OS FOR DISCOVERY':fontcolor=0x8BBACB:fontsize={int(w*.034)}:x=(w-text_w)/2:y={int(h*.59)}:enable='between(t,16.85,21)',"
        "format=yuv420p"
    )
    return split + concat + base


def make_text_only_filter(w: int, h: int) -> str:
    font = r"C\:/Windows/Fonts/arialbd.ttf"
    # Procedural starfield: no footage, no logo plate, just a restrained premium
    # space background behind the words.
    stars = []
    seed = 9173
    for i in range(125):
        seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
        x = int((seed % 10000) / 10000 * w)
        seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
        y = int((seed % 10000) / 10000 * h)
        seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
        size = max(10, int(w * (0.0045 + (seed % 12) / 10000)))
        color = "0xFFFFFF@0.98" if i % 5 else "0x71DDFF@1.0"
        phase = (seed % 31) / 10
        # Fast, obvious star motion: larger travel and a quicker orbit cadence.
        drift_x = int(w * (0.05 + (i % 5) * 0.018))
        drift_y = int(h * (0.014 + (i % 4) * 0.006))
        stars.append(f"drawtext=fontfile='{font}':text='*':fontcolor={color}:fontsize={size}:x='{x}+{drift_x}*sin(t*0.82+{phase})':y='{y}+{drift_y}*cos(t*0.67+{phase})':alpha='0.92+0.08*sin(t*0.9+{phase})',")
    bg = (
        f"color=c=0x000000:s={w}x{h}:r=30:d=24,"
        + "".join(stars) +
        "drawbox=x=0:y=0:w=iw:h=ih:color=0x020A16@0.18:t=fill,"
        # Hook.
        f"drawtext=fontfile='{font}':text='THE WAY WE UNDERSTAND':fontcolor=0xD9F7FF:fontsize={int(w*.059)}:x=(w-text_w)/2:y={int(h*.37)}:shadowcolor=0x00BFFF@.72:shadowx=3:shadowy=0:enable='between(t,.18,1.3)',"
        f"drawtext=fontfile='{font}':text='SCIENCE':fontcolor=white:fontsize={int(w*.15)}:x=(w-text_w)/2:y={int(h*.42)}:shadowcolor=0x00BFFF@.95:shadowx=5:shadowy=0:enable='between(t,.48,1.9)',"
        f"drawtext=fontfile='{font}':text='IS ABOUT TO CHANGE.':fontcolor=0x88E8FF:fontsize={int(w*.073)}:x=(w-text_w)/2:y={int(h*.55)}:shadowcolor=0x00BFFF@.78:shadowx=3:shadowy=0:enable='between(t,1.2,2.25)',"
        f"drawtext=fontfile='{font}':text='UNTIL NOW.':fontcolor=white:fontsize={int(w*.10)}:x=(w-text_w)/2:y={int(h*.76)}:shadowcolor=0x00BFFF@.85:shadowx=4:shadowy=0:enable='between(t,2.1,2.8)',"
        # Portal names, same content and timing, all readable on the clean field.
    )
    portals = [
        ("PHYSICS WORLD", 2.8), ("VISUAL LANGUAGE", 3.75), ("STUDENTS PORTAL", 4.7),
        ("LIVE SCIENCE NEWS", 5.65), ("MINI EXPERIMENT LAB", 6.6), ("SIMULATION LAB", 7.55),
        ("COSMIC SIMULATION", 8.5), ("TIMELESS PROBLEMS LAB", 9.45), ("POTENTIAL EXPLORER", 10.4),
        ("GLOBAL PROBLEM SOLVER", 11.35), ("IMPACT HUB", 12.3), ("KNOWLEDGE FRONTIER", 13.25),
    ]
    for i, (title, start) in enumerate(portals):
        end = start + .55
        size = int(w * (.055 if len(title) > 18 else .071))
        bg += f"drawtext=fontfile='{font}':text='{title}':fontcolor={'0xE2FAFF' if i%2 else 'white'}:fontsize={size}:x=(w-text_w)/2:y={int(h*.46)}:shadowcolor=0x00CFFF@.95:shadowx=4:shadowy=0:enable='between(t,{start},{end})',"
    bg += (
        f"drawtext=fontfile='{font}':text='SEE.':fontcolor=white:fontsize={int(w*.23)}:x=(w-text_w)/2:y={int(h*.38)}:shadowcolor=0x00CFFF@.95:shadowx=5:shadowy=0:enable='between(t,14.45,15.45)',"
        f"drawtext=fontfile='{font}':text='UNDERSTAND.':fontcolor=0xA9F2FF:fontsize={int(w*.14)}:x=(w-text_w)/2:y={int(h*.44)}:shadowcolor=0x00CFFF@.9:shadowx=4:shadowy=0:enable='between(t,15.45,16.55)',"
        f"drawtext=fontfile='{font}':text='DISCOVER.':fontcolor=white:fontsize={int(w*.18)}:x=(w-text_w)/2:y={int(h*.49)}:shadowcolor=0x00CFFF@.95:shadowx=5:shadowy=0:enable='between(t,16.55,17.75)',"
        f"drawtext=fontfile='{font}':text='SCIENCE. WITHOUT LIMITS.':fontcolor=0xDDF8FF:fontsize={int(w*.073)}:x=(w-text_w)/2:y={int(h*.39)}:shadowcolor=0x00CFFF@.8:shadowx=3:shadowy=0:enable='between(t,18.15,20.0)',"
        f"drawtext=fontfile='{font}':text='SCILOOP':fontcolor=white:fontsize={int(w*.195)}:x=(w-text_w)/2:y={int(h*.48)}:shadowcolor=0x00D8FF@.98:shadowx=5:shadowy=0:enable='between(t,19.7,24)',"
        f"drawtext=fontfile='{font}':text='THE VISUAL OS FOR DISCOVERY':fontcolor=0x8AB9CB:fontsize={int(w*.041)}:x=(w-text_w)/2:y={int(h*.59)}:shadowcolor=0x00BFFF@.55:shadowx=2:shadowy=0:enable='between(t,20.4,24)',format=yuv420p"
    )
    return bg


def make_screenshot_reel_filter(w: int, h: int, image_count: int) -> str:
    base = make_text_only_filter(w, h).replace(",format=yuv420p", "") + "[base]"
    overlays = []
    current = "[base]"
    for i in range(image_count):
        # Portal screenshot card appears just after the corresponding title.
        start = 2.8 + i * 0.75 + 0.40
        end = start + 0.30
        label = f"[shot{i}]"
        card_w = int(w * 0.88)
        card_h = int(h * 0.43)
        overlays.append(
            f"[{i+2}:v]scale={int(w*.78)}:-1:force_original_aspect_ratio=decrease,"
            f"pad={card_w}:{card_h}:(ow-iw)/2:(oh-ih)/2:color=0x020A16,format=rgba,setpts=PTS-STARTPTS{label}"
        )
        nxt = f"[mix{i}]"
        overlays.append(
            f"{current}{label}overlay=x=(W-w)/2:y=(H-h)/2:enable='between(t,{start},{end})'{nxt}"
        )
        current = nxt
    return ";".join(overlays) + ";" + current.replace("[mix", "") if False else base + ";" + ";".join(overlays) + f";{current}format=yuv420p"


def render(out_path: str, w: int, h: int):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    vf = make_text_only_filter(w, h)
    af = "atrim=duration=24,afade=t=in:st=0:d=0.12,afade=t=out:st=23.55:d=0.45,volume=0.82,aresample=async=1:first_pts=0"
    cmd = [
        FFMPEG, "-y", "-hide_banner", "-loglevel", "warning",
        "-f", "lavfi", "-i", f"color=c=0x01050D:s={w}x{h}:r=30:d=24",
        "-ss", MUSIC_START, "-i", SOURCE_AUDIO,
    ]
    cmd += [
        "-filter_complex", f"{vf}[v];[1:a]{af}[a]",
        "-map", "[v]", "-map", "[a]", "-t", "24",
        "-r", "30", "-threads", "1", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-profile:v", "high", "-level", "5.1", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out_path,
    ]
    subprocess.run(cmd, check=True)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--size", default="1080x1920")
    ap.add_argument("--output", required=True)
    args = ap.parse_args()
    width, height = map(int, args.size.lower().split("x"))
    render(args.output, width, height)
    print(f"Rendered {args.output} at {width}x{height}, 24 seconds")
