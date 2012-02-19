// package com.mojang.ld22.entity.particle;

// import com.mojang.ld22.entity.Entity;

function Particle() {

}

Particle.Super = Entity.prototype;
Particle.prototype = extend({}, new Entity(), {

  tick: function() {}

});


// public class Particle extends Entity {
//  public Particle() {
//  }

//  public void tick() {
//  }
// }
