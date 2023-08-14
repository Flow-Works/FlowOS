/* eslint-env browser */

import jsmediatags from 'https://cdn.jsdelivr.net/npm/jsmediatags-web@0.0.4/+esm';
import BrowserFS from 'https://cdn.jsdelivr.net/npm/browserfs@1.4.3/+esm';

let fs;

BrowserFS.install(window);
BrowserFS.configure(
	{
		fs: 'AsyncMirror',
		options: {
			sync: { fs: 'InMemory' },
			async: {
				fs: 'IndexedDB',
				options: {
					storeName: 'root',
				},
			},
		},
	},
	async (e) => {
		if (e) console.error(e);

		fs = require('fs');

		if (!fs.existsSync('media')) fs.mkdirSync('media');
		if (!fs.existsSync('media/music')) fs.mkdirSync('media/music');
		if (!fs.existsSync('media/videos')) fs.mkdirSync('media/videos');

		let songs = [];
		let index;

		const checkFolder = async (fs, directoryPath) => {
			songs = [];
			index = undefined;
			document.querySelector('.songList').innerHTML = '';
			if (fs.existsSync(directoryPath)) {
				fs.readdirSync(directoryPath).forEach((file) => {
					const curPath = `${directoryPath}/${file}`;
					if (fs.statSync(curPath).isDirectory() && curPath !== '/media/music/.git') {
						checkFolder(fs, curPath);
					} else {
                        if (curPath == '/media/music/.git') return;
						songs.push(curPath.split('/media/music')[1]);
						document.querySelector(
							'.songList'
						).innerHTML += `<a onclick="window.playSong('${
							curPath.split('/media/music')[1]
						}');">${curPath}</a><br/>`;
					}
				});
			}
		};

        document.body.onkeyup = (e) => {
            if (e.code == 'Space') {
                window.togglePlayback();
            }
        };

		window.next = () => {
			if (!document.querySelector('audio').src) return;
			if (index !== songs.length - 1) window.playSong(songs[index + 1]);
		};

		window.prev = () => {
			if (!document.querySelector('audio').src) return;
			if (index > 0) window.playSong(songs[index - 1]);
		};

		window.togglePlayback = () => {
			if (!document.querySelector('audio').src) return;

			if (!document.querySelector('audio').paused) {
				document.querySelector('audio').pause();
			} else {
				document.querySelector('audio').play();
			}
			document.querySelector('.e').innerText = document.querySelector('audio')
				.paused
				? '󰐊'
				: '󰏤';
		};

		const formatSecondsAsTime = (secs, format) => {
			let hr = Math.floor(secs / 3600);
			let min = Math.floor((secs - hr * 3600) / 60);
			let sec = Math.floor(secs - hr * 3600 - min * 60);

			if (min < 10) {
				min = '0' + min;
			}
			if (sec < 10) {
				sec = '0' + sec;
			}

			return min + ':' + sec;
		};

		const updateTrackTime = (track) => {
			let currTimeDiv = document.getElementById('currentTime');
			let durationDiv = document.getElementById('duration');

			let currTime = Math.floor(track.currentTime).toString();
			let duration = Math.floor(track.duration).toString();

			currTimeDiv.innerHTML = formatSecondsAsTime(currTime);

			if (isNaN(duration)) {
				durationDiv.innerHTML = '00:00';
			} else {
				durationDiv.innerHTML = formatSecondsAsTime(duration);
			}
		};

        const sliderEl = document.querySelector('#seekbar');

		document.querySelector('audio').ontimeupdate = () => {
            const tempSliderValue = document.querySelector('#seekbar').value;
            const progress = (tempSliderValue / sliderEl.max) * 100;
            sliderEl.style.background = `linear-gradient(to right, var(--primary) ${progress}%, var(--window-bg) ${progress}%)`;

			updateTrackTime(document.querySelector('audio'));
			document.querySelector('#seekbar').value =
				(document.querySelector('audio').currentTime /
					document.querySelector('audio').duration) *
				500;
		};

		document.querySelector('#seekbar').oninput = (event) => {
            const tempSliderValue = event.target.value;
            const progress = (tempSliderValue / sliderEl.max) * 100;
            sliderEl.style.background = `linear-gradient(to right, var(--primary) ${progress}%, var(--window-bg) ${progress}%)`;

			if (!document.querySelector('audio').src) return;
			document.querySelector('audio').currentTime =
				(document.querySelector('#seekbar').value *
					document.querySelector('audio').duration) /
				500;
		};

		window.playSong = async (filePath) => {
			const song = await fs.readFileSync(`/media/music/${filePath}`);

			const blob = new Blob([song.buffer], { type: 'audio/wav' });
			const url = window.URL.createObjectURL(blob);
			document.querySelector('audio').src = url;
			window.togglePlayback();

			document.querySelector('audio').onended = () => {
				window.next();
			};

			index = songs.findIndex((x) => x == filePath);

			jsmediatags.read(song, {
				onSuccess: (tag) => {
					let format, base64String;
					try {
						const data = tag.tags.picture.data;
						format = tag.tags.picture.format;
						base64String = '';
						for (const dataElement of data) {
							base64String += String.fromCharCode(dataElement);
						}
						base64String = btoa(base64String);
						// Output the metadata
					} catch (e) {
						format = 'image/png';
						base64String =
							'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';
					}

					document.querySelector(
						'#cover'
					).src = `data:${format};base64,${base64String}`;

					document.querySelector('#title').textContent =
						tag.tags.title ?? filePath.split('/').pop();
					document.querySelector('#artist').textContent = tag.tags.artist;

					if ('mediaSession' in navigator) {
						navigator.mediaSession.metadata = new MediaMetadata({
							title: tag.tags.title,
							artist: tag.tags.artist,
							album: tag.tags.album,
							artwork: [
								{
									src: `data:${format};base64,${base64String}`,
									type: format,
								},
							],
						});

                        navigator.mediaSession.setActionHandler('play', () => {
                            window.togglePlayback();
                        });

                        navigator.mediaSession.setActionHandler('pause', () => {
                            window.togglePlayback();
                        });

						navigator.mediaSession.setActionHandler('nexttrack', () => {
							window.next();
						});

						navigator.mediaSession.setActionHandler('previoustrack', () => {
							window.prev();
						});
					}
				},
				onError: (error) => {
					console.log(error);
					document.querySelector('#title').textContent = filePath
						.split('/')
						.pop();
					document.querySelector('#artist').textContent = '';

					if ('mediaSession' in navigator) {
						document.querySelector('#cover').src =
							'data:image/png;base64,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';
						navigator.mediaSession.metadata = new MediaMetadata({
							title: filePath.split('/').pop(),
							artwork: [
								{
									src: 'data:image/png;base64,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',
									type: 'image/png',
								},
							],
						});

						navigator.mediaSession.setActionHandler('nexttrack', () => {
							window.playSong(songs[index + 1]);
						});

						navigator.mediaSession.setActionHandler('previoustrack', () => {
							if (index > 0) window.playSong(songs[index - 1]);
						});
					}
				},
			});
		};

		checkFolder(fs, '/media/music');

		document
			.querySelector('#song-input')
			.addEventListener('change', async (event) => {
				await fs.writeFileSync(
					`/media/music/${event.target.files[0].name}`,
					new Buffer(await event.target.files[0].arrayBuffer())
				);

				await checkFolder(fs, '/media/music');
				window.playSong('/' + event.target.files[0].name);
			});
	}
);
