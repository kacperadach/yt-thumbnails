import os
import re
import subprocess
from yt_dlp import YoutubeDL

TMP_DIR = "/tmp"

DEFAULT_YT_DLP_ARGS = {
    "quiet": True,
    "noprogress": True,
    "no_warnings": True,
    "ignoreerrors": False,
    "nocheckcertificate": True,
    "check_formats": False,
    "writeinfojson": False,
    "restrictfilenames": True,
}

DEFAULT_YT_DLP_INFO_ARGS = {
    "simulate": True,
    "skip_download": True,
    "dump_single_json": True,
    "no_color": True,
}


class DownloadHook:
    filename = None

    def get_filename(self, info):
        if not self.filename:
            self.filename = info["filename"]


def _get_closest_available_format(
    formats,
    resolution,
    fps=30,
    ext=None,
    vcodec=None
    # preffered_format_id=None,
):
    try:
        format_ = next(
            (
                format_
                for format_ in formats[::-1]
                if (ext is None or format_.get("ext") == ext)
                and format_.get("height") is not None
                and format_.get("height") <= resolution
                and format_.get("fps") is not None
                and round(format_.get("fps")) <= fps
                and (vcodec is None or vcodec in format_.get("vcodec", ""))
            ),
            None,
        )
        if not format_:
            # if there are no available formats with the same extension,
            # find the extension that maintains the same format_type (video or audio)
            # and return the closest
            format_ = None
            for ft in formats:
                if ft.get("format_note") == "DASH audio" or ft.get("ext") == "mhtml":
                    continue
                if ft.get("height") is not None and ft.get("height") <= resolution:
                    format_ = ft
                    break

        return format_
    except Exception as exc:
        print(exc)
        return None


def download_twitch_stream_info(url: str):
    with YoutubeDL({**DEFAULT_YT_DLP_ARGS, **DEFAULT_YT_DLP_INFO_ARGS}) as ydl:
        return ydl.extract_info(url, download=False)


def download_twitch_vod(url, resolution=720, info=None):
    if not info:
        info = download_twitch_stream_info(url)

    print([f.get("height") for f in info["formats"]])
    format_ = _get_closest_available_format(
        info["formats"],
        resolution=resolution,
        fps=30,
    )
    print(format_)
    twitch_download = DownloadHook()
    with YoutubeDL(
        {
            "progress_hooks": [twitch_download.get_filename],
            "paths": {"home": TMP_DIR},
        }
    ) as ydl:
        ydl.download(url)

    return twitch_download.filename


def download_youtube_info(url):
    # def download_ranges(info_dict, ydl):
    #     print(download_ranges)
    #     section = {
    #         "start_time": 0,
    #         "end_time": 10,
    #         "title": "First 10 seconds",
    #         "index": 1,  # if you want to number this section
    #     }
    #     return [section]

    ydl_opts = {
        **DEFAULT_YT_DLP_ARGS,
        **DEFAULT_YT_DLP_INFO_ARGS,
        "no_playlist": True,
        "default_search": "ytsearch",
        "extractor_args": {
            "youtube:search_max_results": 1000,
        },
    }
    with YoutubeDL(ydl_opts) as ydl:
        return ydl.extract_info(url, download=False)


def download_youtube_vod(url, resolution=720, info=None):
    # def download_ranges(info_dict, ydl):
    #     print("download_ranges")
    #     section = {
    #         "start_time": 100,
    #         "end_time": 200,
    #         "title": "First 10 seconds",
    #         "index": 1,  # if you want to number this section
    #     }
    #     return [section]

    if not info:
        info = download_youtube_info(url)
    print([f.get("height") for f in info["formats"]])
    format_ = _get_closest_available_format(
        info["formats"],
        resolution=resolution,
        fps=30,
    )
    print(format_)
    youtube_download = DownloadHook()

    ydl_opts = {
        "progress_hooks": [youtube_download.get_filename],
        "paths": {"home": TMP_DIR},
        # "download_ranges": download_ranges,
    }

    with YoutubeDL(ydl_opts) as ydl:
        ydl.download(url)

    return re.sub(r"\.f\d+", "", youtube_download.filename)


def extract_clip(path, start, end):
    file_extension = os.path.splitext(path)[1]
    output_path = path.rsplit(".", 1)[0] + "_trimmed" + file_extension
    try:
        # if file_extension == ".mp4":
        command = [
            "ffmpeg",
            "-i",
            path,  # Input file
            "-ss",
            str(start),  # Start time
            "-to",
            str(end),  # End time
            # "-c",
            # "copy",  # Copy the stream directly, no re-encoding
            output_path,  # Output file
        ]
        # elif file_extension == ".webm":
        #     command = [
        #         "ffmpeg",
        #         "-i",
        #         path,  # Input file
        #         "-ss",
        #         str(start),  # Start time
        #         "-to",
        #         str(end),  # End time
        #         "-c:v",
        #         "libvpx",  # Video codec for WebM
        #         "-c:a",
        #         "libvorbis",  # Audio codec for WebM
        #         output_path,  # Output file
        #     ]
        # else:
        #     raise ValueError("Unsupported file format")

        # Execute the command
        subprocess.run(command, check=True)
        print(f"Clip extracted successfully to {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")
    except ValueError as e:
        print(e)

def extract_clip_2_step_mp4(path: str, start: int, end: int, buffer=30):
    file_extension = os.path.splitext(path)[1]
    intermediate_output_path = (
        path.rsplit(".", 1)[0] + f"_{int(start)}_{int(end)}" + "_intermediate" + file_extension
    )
    final_output_path = (
        path.rsplit(".", 1)[0] + f"_{int(start)}_{int(end)}" + "_trimmed" + file_extension
    )

    # with tempfile.NamedTemporaryFile(suffix=file_extension, delete=True) as temp_file:
    #     shutil.copy2(path, temp_file.name)
    #     temp_input_path = temp_file.name
    try:
        # Step 1: Fast cut with buffer

        adjusted_start_time = max(0, start - buffer)
        adjusted_end_time = end + buffer
        fast_cut_command = [
            "ffmpeg",
            "-i",
            path,  # Input file
            "-ss",
            str(adjusted_start_time),  # Start time with buffer
            "-to",
            str(adjusted_end_time),  # End time with buffer
            "-c",
            "copy",  # Copy the stream directly, no re-encoding
            intermediate_output_path,  # Intermediate output file
        ]
        subprocess.run(fast_cut_command, check=True)

        # Step 2: Precise cut with re-encoding
        precise_start_time = buffer if start > buffer else start
        precise_end_time = end - start + buffer
        precise_cut_command = [
            "ffmpeg",
            "-i",
            intermediate_output_path,  # Intermediate file as input
            "-ss",
            str(precise_start_time),  # Adjusted start time for precise cut
            "-to",
            str(precise_end_time),  # Adjusted end time for precise cut
            "-c:v",
            "libx264",  # Re-encode video
            "-c:a",
            "aac",  # Re-encode audio
            final_output_path,  # Final output file
        ]
        subprocess.run(precise_cut_command, check=True)

        print(f"Clip extracted successfully to {final_output_path}")
        return final_output_path
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")
    except ValueError as e:
        print(e)


if __name__ == "__main__":
    # extract_clip("nicki.webm", 401, 402)
    # download_youtube_vod("https://www.youtube.com/watch?v=LPDTuHcua0o")
    # print(
    #     download_youtube_info("https://www.youtube.com/watch?v=LPDTuHcua0o").get(
    #         "thumbnail"
    #     )
    # )
    # download_twitch_vod("https://www.twitch.tv/videos/2036419299")
    # extract_clip("pentakill.mp4", 7092, 7134)
    # extract_clip("clip.mp4", 7080, 7150)
    # extract_clip("clip.mp4", 13, 54)

    #  1:58:13  3600 + 3480 + 13 = 7093
    #  1:58:54 3600 + 3480 + 54 = 7134

    # download_youtube_vod("https://www.youtube.com/watch?v=1RCMYG8RUSE")

    # download_twitch_vod("https://www.twitch.tv/videos/2044459054", resolution=99999)
    extract_clip_2_step_mp4("/tmp/video.mp4", 6452, 6493)
