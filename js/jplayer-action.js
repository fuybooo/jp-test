(function () {
  $(document).ready(function () {
    const $player = $('#imc-music-player-js');
    const repeatType = ['list', 'random', 'single'];
    let repeatTypeIndex = 0;
    let currentMusic = jplayerActionData.musicList[0];
    console.log(currentMusic);
    $('.imc-music-list-js')
      .empty()
      .html(getMusicListHtml(jplayerActionData.musicList));
    initPlayer();
    let duration = 0;
    $('.imc-music-player-box-js')
    // 暂停
      .on('click', '.imc-ctrl-pause-js', function () {
        $player.jPlayer('pause');
        $('.imc-ctrl-pause-js').addClass('dn');
        $('.imc-ctrl-play-js').removeClass('dn');
      })
      // 播放
      .on('click', '.imc-ctrl-play-js', function () {
        $player.jPlayer('play');
        $('.imc-ctrl-play-js').addClass('dn');
        $('.imc-ctrl-pause-js').removeClass('dn');
      })
        // 上一曲
      .on('click', '.imc-ctrl-prev-js', function () {
        getCurrentMusic('prev');
        $player.jPlayer('setMedia', {
          title: currentMusic.name,
          mp3: currentMusic.src
        }).jPlayer('play');
      })
      // 下一曲
      .on('click', '.imc-ctrl-next-js', function () {
        getCurrentMusic('next');
        $player.jPlayer('setMedia', {
          title: currentMusic.name,
          mp3: currentMusic.src
        }).jPlayer('play');
      })
      .on('click', '.imc-ctrl-repeat-js', function () {
        repeatTypeIndex = (repeatTypeIndex + 1) % 3;
        $(this).removeClass('imc-ctrl-repeat-random')
          .removeClass('imc-ctrl-repeat-list')
          .removeClass('imc-ctrl-repeat-single')
          .addClass('imc-ctrl-repeat-' + repeatType[repeatTypeIndex])
      })
      // 跳转
      .on('click', '.imc-progress-mask-js', function (event) {
        const x = event.pageX || event.clientX;
        const offset = $('.imc-progress-mask-js').offset().left;
        const progressWidth = $('.imc-progress-mask-js').width();
        const per = (x - offset) / progressWidth;
        if (duration) {
          $player.jPlayer('playHead', per * 100);
        }
      })
      .on('click', '.imc-ctrl-img-js', function () {
        $('.imc-voice-bg-js').toggleClass('dn');
      })
      .on('click', '.imc-voice-bar-mask-js', function (event) {
        const y = event.pageY || event.clientY;
        const offset = $('.imc-voice-bar-mask-js').offset();
        $('.imc-voice-bar-js').height(100 - (y - offset.top));
        $('.imc-dot-small-js').css('top', (y - offset.top));
        $player.jPlayer('volume', 1 - (y - offset.top) / 100);
      });
    // 绑定document的点击事件，当点击到非voice-bg区域时，关闭
    $(document).on('click.voice', function (event) {
      if (!$('.imc-voice-bg-js').hasClass('dn') && !(
        $(event.target).hasClass('imc-ctrl-img-js') ||
        $(event.target).hasClass('imc-voice-bg-js') ||
        $.contains($('.imc-voice-bg-js')[0], event.target)
      )) {
        $('.imc-voice-bg-js').addClass('dn');
      }
    });

    // 播放的时候运行
    $player.on($.jPlayer.event.timeupdate, function (event) {
      // console.log(event.jPlayer.status);
      duration = event.jPlayer.status.duration;
      $('.imc-time-current-js').html($.jPlayer.convertTime(event.jPlayer.status.currentTime));
      $('.imc-time-total-js').html($.jPlayer.convertTime(duration));
      $('.imc-progress-current-js').width(`${event.jPlayer.status.currentPercentAbsolute}%`);
      $('.imc-dot-big-js').css('left', `${event.jPlayer.status.currentPercentAbsolute}%`);
    });

    function initPlayer() {
      $player.jPlayer({
        ready: function () {
          $(this).jPlayer('setMedia', {
            title: currentMusic.name,
            mp3: currentMusic.src
          }).jPlayer('play');
          getCurrentMusicInfo();
        },
        ended: function () {
          getCurrentMusic('next');
          $player.jPlayer('setMedia', {
            title: currentMusic.name,
            mp3: currentMusic.src
          }).jPlayer('play')
        },
        swfPath: './node_modules/jplayer/dist/jplayer',
        supplied: 'mp3',
        wmode: 'window',
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: true,
        toggleDuration: true,
        timeFormat: {
          showMin: true,
          showSec: true,
          sepMin: ':'
        }
      });
    }

    /**
     * 获取接下来的music
     * 点击上一曲 prev
     * 点击下一曲 next
     * @param type
     */
    function getCurrentMusic(type) {
      // 找到当前music所在的位置
      const currentIndex = jplayerActionData.musicList.findIndex(item => item === currentMusic);
      // 列表循环
      if (repeatTypeIndex === 0) {
        let index = 0;
        if (type === 'prev') {
          index = currentIndex ? currentIndex - 1 : jplayerActionData.musicList.length - 1;
        } else if (type === 'next') {
          index = currentIndex === jplayerActionData.musicList.length - 1 ? 0 : currentIndex + 1;
        }
        currentMusic = jplayerActionData.musicList[index];
      } else if (repeatTypeIndex === 1) {
        if (type === 'prev') {
          // 取上一次播放的歌曲
          currentMusic = jplayerActionData.musicList[currentIndex ? currentIndex - 1 : jplayerActionData.musicList.length - 1];
        } else if (type === 'next') {
          let index = Math.floor(Math.random() * jplayerActionData.musicList.length);
          while (index === currentIndex) {
            index = Math.floor(Math.random() * jplayerActionData.musicList.length);
          }
          currentMusic = jplayerActionData.musicList[index];
        }
      }
      getCurrentMusicInfo();
    }
    function getCurrentMusicInfo() {
      $('.imc-title-text-js').html(currentMusic.name);
      $('.imc-artist-text-js').html(currentMusic.artist);
      $('.imc-music-img-js').css({
        'background-image': `url("${currentMusic.img}")`
      });
    }
  });
})();

function getMusicListHtml(list) {
  return list.map(item => `
      <li class="imc-item">
        <span class="imc-artist">${item.artist}</span>
        <span class="imc-name">${item.name}</span>
      </li>
    `).join('');
}
