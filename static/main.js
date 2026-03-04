var windowWidth = $(window).width();
layer.config({
  extend: "kzhomepage/style.css", //加载扩展样式
  skin: "layer-ext-kzhomepage",
});

// Nav buttons
$(".kz-nav-btn").on("click", function () {
  let btn = $(this);
  let type = btn.data("window"); // pop current newtab
  let content = btn.data("href");
  switch (type) {
    case "pop":
      let title = btn.data("title");
      let shadeClose = btn.data("shade") === "true" ? false : true;
      let anim = btn.data("anim") ? btn.data("anim") * 1 : 4;
      let area_w = btn.data("area-w") ? btn.data("area-w") : "80%";
      let area_h = btn.data("area-h") ? btn.data("area-h") : "90%";
      layer.open({
        type: 2,
        title: title,
        shadeClose: shadeClose,
        anim: anim,
        closeBtn: 2,
        isOutAnim: false,
        area: [area_w, area_h],
        content: content,
      });
      break;
    case "current":
      window.location = content;
      break;
    case "newtab":
      window.open("_blank").location = content;
      break;
  }
});

$.ajax({
  url: meting_music_api,
  data: {
    server: music_server,
    type: music_type,
    id: music_id,
  },
  dataType: "json",
  success: function (audio) {
    const bindVolumeDragFix = function (ap) {
      if (!ap || !ap.template || !ap.template.volumeBarWrap || !ap.template.volumeBar) {
        return;
      }

      const volumeBarWrap = ap.template.volumeBarWrap;
      const volumeBar = ap.template.volumeBar;

      const getClientY = function (event) {
        if (event.touches && event.touches[0]) {
          return event.touches[0].clientY;
        }
        if (event.changedTouches && event.changedTouches[0]) {
          return event.changedTouches[0].clientY;
        }
        return event.clientY;
      };

      const setVolumeByEvent = function (event) {
        const clientY = getClientY(event);
        if (typeof clientY !== "number") {
          return;
        }

        const rect = volumeBar.getBoundingClientRect();
        if (!rect.height) {
          return;
        }

        let percentage = (rect.bottom - clientY) / rect.height;
        percentage = Math.max(0, Math.min(1, percentage));
        ap.volume(percentage);
      };

      const onMove = function (event) {
        event.preventDefault();
        setVolumeByEvent(event);
      };

      const onEnd = function (event) {
        setVolumeByEvent(event);
        volumeBarWrap.classList.remove("aplayer-volume-bar-wrap-active");
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onEnd);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onEnd);
      };

      const onStart = function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        volumeBarWrap.classList.add("aplayer-volume-bar-wrap-active");
        setVolumeByEvent(event);
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onEnd);
        document.addEventListener("touchmove", onMove, { passive: false });
        document.addEventListener("touchend", onEnd);
      };

      volumeBarWrap.addEventListener("mousedown", onStart, true);
      volumeBarWrap.addEventListener("touchstart", onStart, { capture: true, passive: false });
    };

    const ap = new APlayer({
      container:
        music_fixed === false
          ? document.getElementById("aplayer-inner")
          : document.getElementById("aplayer-fixed"),
      audio: audio,
      fixed: music_fixed === false ? false : true,
      autoplay: music_autoplay,
      order: music_order,
      listFolded: true,
      volume: music_volume,
      mini: music_fixed === true ? true : music_mini,
      lrcType: 3,
      preload: "auto",
      loop: music_loop,
    });

    bindVolumeDragFix(ap);
  },
});

fetch(hitokoto_api)
  .then((response) => response.json())
  .then((data) => {
    const hitokoto = document.getElementById("hitokoto_text");
    hitokoto.href = "https://hitokoto.cn/?uuid=" + data.uuid;
    hitokoto.innerText = data.hitokoto;
  })
  .catch(console.error);
