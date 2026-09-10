(function () {
  "use strict";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  class SciLoopFallbackAISimulation {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas ? canvas.getContext("2d") : null;
      this.options = Object.assign({
        gravity: 9.8,
        speed: 1.2,
        population: 34,
        energy: 62,
        temperature: 24
      }, options);
      this.agents = [];
      this.resources = [];
      this.collisionCount = 0;
      this.frame = 0;
      this.animationId = null;
    }

    loadSimulation(command) {
      const variables = command && (command.variables || command.controls) ? (command.variables || command.controls) : {};
      this.options = Object.assign({}, this.options, variables);
      this.reset();
    }

    reset() {
      this.agents = [];
      this.resources = [];
      this.collisionCount = 0;
      this.frame = 0;
    }

    stop() {
      if (this.animationId) cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    start(onResults) {
      this.stop();
      const tick = () => {
        this.step();
        this.draw();
        if (this.frame % 15 === 0 && typeof onResults === "function") {
          onResults(this.getResults());
        }
        this.animationId = requestAnimationFrame(tick);
      };
      tick();
    }

    ensureSize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      const width = Math.max(320, Math.floor(rect.width * dpr));
      const height = Math.max(240, Math.floor(rect.height * dpr));
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
      return { width, height, dpr };
    }

    ensureAgents(width, height) {
      const desired = Math.round(this.options.population);
      while (this.agents.length < desired) {
        this.agents.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8,
          radius: 4 + Math.random() * 4,
          energy: this.options.energy,
          alive: true
        });
      }
      while (this.agents.length > desired) this.agents.pop();
    }

    ensureResources(width, height) {
      const desired = Math.max(4, Math.round(this.options.population / 4));
      while (this.resources.length < desired) {
        this.resources.push({
          x: 32 + Math.random() * Math.max(1, width - 64),
          y: 32 + Math.random() * Math.max(1, height - 64),
          value: Math.max(8, this.options.energy / 3),
          pulse: Math.random() * Math.PI * 2
        });
      }
      while (this.resources.length > desired) this.resources.pop();
    }

    findNearestResource(agent) {
      let nearest = null;
      let distance = Infinity;
      for (const resource of this.resources) {
        const dx = resource.x - agent.x;
        const dy = resource.y - agent.y;
        const current = Math.sqrt(dx * dx + dy * dy);
        if (current < distance) {
          nearest = resource;
          distance = current;
        }
      }
      return { nearest, distance };
    }

    step() {
      if (!this.canvas || !this.ctx) return;
      const { width, height, dpr } = this.ensureSize();
      this.ensureAgents(width, height);
      this.ensureResources(width, height);
      this.frame += 1;

      const speed = this.options.speed * (0.55 + this.options.energy / 100);
      const gravity = (this.options.gravity - 9.8) * 0.002 * dpr;
      for (const agent of this.agents) {
        if (agent.energy <= 0) {
          agent.alive = false;
          continue;
        }
        const target = this.findNearestResource(agent);
        if (target.nearest) {
          const dx = target.nearest.x - agent.x;
          const dy = target.nearest.y - agent.y;
          const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          agent.vx += (dx / dist) * 0.018 * speed;
          agent.vy += (dy / dist) * 0.018 * speed;
          if (target.distance < 18 * dpr) {
            agent.energy = clamp(agent.energy + target.nearest.value, 0, 100);
            target.nearest.x = 32 + Math.random() * Math.max(1, width - 64);
            target.nearest.y = 32 + Math.random() * Math.max(1, height - 64);
          }
        }
        agent.energy = clamp(agent.energy - (0.018 + this.options.speed * 0.006 + Math.abs(this.options.temperature - 24) * 0.0008), 0, 100);
        agent.vy += gravity;
        agent.vx += (Math.random() - 0.5) * 0.04;
        agent.vy += (Math.random() - 0.5) * 0.04;
        agent.vx = clamp(agent.vx, -2.8, 2.8);
        agent.vy = clamp(agent.vy, -2.8, 2.8);
        agent.x += agent.vx * speed * dpr;
        agent.y += agent.vy * speed * dpr;
        if (agent.x < 18 || agent.x > width - 18) {
          agent.vx *= -0.86;
          this.collisionCount += 1;
        }
        if (agent.y < 18 || agent.y > height - 18) {
          agent.vy *= -0.86;
          this.collisionCount += 1;
        }
        agent.x = clamp(agent.x, 18, width - 18);
        agent.y = clamp(agent.y, 18, height - 18);
      }
    }

    draw() {
      if (!this.canvas || !this.ctx) return;
      const { width, height, dpr } = this.ensureSize();
      const ctx = this.ctx;
      const temp = clamp((this.options.temperature + 20) / 100, 0, 1);
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "#030711");
      bg.addColorStop(0.5, temp > 0.58 ? "#160c12" : "#061321");
      bg.addColorStop(1, "#02050c");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      for (const resource of this.resources) {
        resource.pulse += 0.045;
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 209, 102, 0.92)";
        ctx.shadowColor = "rgba(255, 209, 102, 0.55)";
        ctx.shadowBlur = 22 * dpr;
        ctx.arc(resource.x, resource.y, (6 + Math.sin(resource.pulse) * 2) * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const agent of this.agents) {
        ctx.beginPath();
        ctx.fillStyle = agent.alive === false ? "rgba(255, 107, 107, 0.18)" : `rgba(125, 211, 252, ${0.35 + agent.energy / 180})`;
        ctx.shadowColor = "rgba(125, 211, 252, 0.36)";
        ctx.shadowBlur = 16 * dpr;
        ctx.arc(agent.x, agent.y, agent.radius * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    getResults() {
      const alive = this.agents.filter((agent) => agent.alive !== false);
      const energyTotal = alive.reduce((sum, agent) => sum + agent.energy, 0);
      const temperatureStress = Math.abs(this.options.temperature - 24) / 80;
      const crowdStress = Math.max(0, (this.options.population - 45) / 95);
      return {
        aliveAgents: alive.length,
        averageEnergy: alive.length ? energyTotal / alive.length : 0,
        collisionCount: this.collisionCount,
        stabilityScore: clamp(0.92 - temperatureStress * 0.5 - crowdStress * 0.28 + this.options.energy / 100 * 0.12, 0.05, 0.99)
      };
    }
  }

  window.SciLoopFallbackAISimulation = SciLoopFallbackAISimulation;
})();
