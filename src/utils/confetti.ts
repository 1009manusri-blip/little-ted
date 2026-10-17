import confetti from 'canvas-confetti';

export function fireCuteConfetti(origin = { x: 0.5, y: 0.6 }) {
  // Pastel confetti explosion
  confetti({
    particleCount: 60,
    spread: 70,
    origin,
    colors: ['#FF70B8', '#FFE66D', '#B99AFF', '#83D9FF', '#A5F3C1', '#FF5964'],
    shapes: ['circle', 'square'],
    scalar: 1.2,
    ticks: 200,
  });
}

export function fireHearts() {
  // Heart/star shaped burst
  const end = Date.now() + 1000;
  const colors = ['#FF70B8', '#FF5964', '#B99AFF', '#FFE66D'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
