// package com.mojang.ld22.sound;

// import java.applet.Applet;
// import java.applet.AudioClip;



class Sound {

  constructor(name) {
    const format = Sound.format != null ? Sound.format : Sound.detectFormat()
    const clip = this.clip = new Audio()
    clip.src = `../res/${name}.${format.ext}`
    clip.load()
    clip.addEventListener('ended', this.ended.bind(this))
  }

  play() {
    if (!Sound.enabled) return false

    if (this.playing) {
      this.clip.pause()
    }
    this.playing = true
    this.clip.play()
  }

  ended() {
    this.playing = false
  }

};

extend(Sound, {

  enabled: true,

  formats: [
    {ext: 'wav', mime: 'audio/wav'},
    {ext: 'mp3', mime: 'audio/mpeg'},
    {ext: 'ogg', mime: 'audio/ogg; codecs=vorbis'}
  ],

  detectFormat: function() {
    var a = new Audio();
    for (var i = 0; i < Sound.formats.length; i++) {
      var format = Sound.formats[i];
      if (a.canPlayType(format.mime)) {
        return Sound.format = format;
      }
    }
    Sound.enabled = false;
    return null;
  }

});

extend(Sound, {
  playerHurt: new Sound('playerhurt'),
  playerDeath: new Sound('death'),
  monsterHurt: new Sound('monsterhurt'),
  bossdeath: new Sound('bossdeath'),
  pickup: new Sound('pickup'),
  craft: new Sound('craft'),
  test: new Sound('test')
});



// public class Sound {
//  public static final Sound playerHurt = new Sound("/playerhurt.wav");
//  public static final Sound playerDeath = new Sound("/death.wav");
//  public static final Sound monsterHurt = new Sound("/monsterhurt.wav");
//  public static final Sound test = new Sound("/test.wav");
//  public static final Sound pickup = new Sound("/pickup.wav");
//  public static final Sound bossdeath = new Sound("/bossdeath.wav");
//  public static final Sound craft = new Sound("/craft.wav");

//  private AudioClip clip;

//  private Sound(String name) {
//    try {
//      clip = Applet.newAudioClip(Sound.class.getResource(name));
//    } catch (Throwable e) {
//      e.printStackTrace();
//    }
//  }

//  public void play() {
//    try {
//      new Thread() {
//        public void run() {
//          clip.play();
//        }
//      }.start();
//    } catch (Throwable e) {
//      e.printStackTrace();
//    }
//  }
// }
