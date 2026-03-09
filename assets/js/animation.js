const plexifyGsap = function () {
	gsap.registerPlugin(
		ScrollTrigger,
		ScrollSmoother,
		MotionPathPlugin,
		SplitText
	);
	let smoother;

	if (!smoother) {
		smoother = ScrollSmoother.create({
		  smooth: 2,
		  effects: true,
		  normalizeScroll: true,
		  smoothTouch: 0.1,
		});
	}

	const initCircleSlider = () => {
		const animatedCircleEl = document.getElementById("animatedCircle");
		if (!animatedCircleEl) return;

		const stepsData = document.querySelectorAll(".service-card-box");
		const stepsContainer = document.getElementById("circleStepsContainer");
		const circle = animatedCircleEl;

		if (!stepsData.length || !stepsContainer || !circle) return;

		if (window.circleTriggers && Array.isArray(window.circleTriggers)) {
		  window.circleTriggers.forEach((trigger) => trigger.kill());
		}
		window.circleTriggers = [];

		stepsContainer.innerHTML = "";

		const totalSteps = stepsData.length;

		let radius, center, circleSize;
		if (window.innerWidth < 1680) {
		  circleSize = 620;
		  radius = 310;
		  center = circleSize / 2;
		} else {
		  circleSize = 717;
		  radius = 355;
		  center = 358.5;
		}

		circle.style.width = `${circleSize}px`;
		circle.style.height = `${circleSize}px`;

		stepsData.forEach((step, i) => {
		  const angle = (360 / totalSteps) * i;
		  const radians = (angle * Math.PI) / 180;
		  const x = center + radius * Math.cos(radians) - 25;
		  const y = center + radius * Math.sin(radians) - 25;

		  const stepDiv = document.createElement("div");
		  stepDiv.className =
			"step flex items-center justify-center absolute dark:bg-bg4 bg-[#F3F6E9] text-[#979797] size-50 rounded-full text-xl font-bold duration-500";
		  stepDiv.style.left = `${x}px`;
		  stepDiv.style.top = `${y}px`;
		  stepDiv.textContent = String(i + 1).padStart(2, "0");

		  stepsContainer.appendChild(stepDiv);
		});

		const pinTrigger = ScrollTrigger.create({
		  trigger: ".circle-sticky-content",
		  start: "top top",
		  endTrigger: ".circle-content-over",
		  end: "bottom-=950",
		  pin: true,
		  pinSpacing: false,
		});
		window.circleTriggers.push(pinTrigger);

		const cardTriggers = stepsData.forEach((card, index) => {
		  const trigger = ScrollTrigger.create({
			trigger: card,
			start: "top center",
			end: "bottom center",
			onEnter: () => updateCircle(index),
			onEnterBack: () => updateCircle(index),
		  });
		  window.circleTriggers.push(trigger);
		});

		const updateCircle = (index) => {
		  const data = stepsData[index];

		  gsap.to(circle, {
			rotate: index * -(360 / totalSteps),
			duration: 0.4,
			ease: "power2.out",
		  });

		  const circleTextEl = document.getElementById("circleText");
		  if (circleTextEl) {
			gsap.set(circleTextEl, { opacity: 1, visibility: "visible" });
			if (circleTextEl._splitInstance?.revert) {
			  circleTextEl._splitInstance.revert();
			}

			circleTextEl.innerHTML = "";
			circleTextEl.innerHTML = data?.dataset?.title || "";

			const split = new SplitText(circleTextEl, {
			  type: "words",
			  wordsClass: "word",
			});
			circleTextEl._splitInstance = split;

			split.words.forEach((wordSpan) => {
			  const wrapper = document.createElement("div");
			  wrapper.className = "word-box";
			  wordSpan.parentNode.insertBefore(wrapper, wordSpan);
			  wrapper.appendChild(wordSpan);
			});

			gsap.from(".word-box", {
			  opacity: 0,
			  y: 60,
			  rotationX: 90,
			  duration: 1.2,
			  ease: "back.out(1.7)",
			  stagger: 0.07,
			});
		  }

		  const circleIconEl = document.getElementById("circleIcon");
		  const serviceIcon = data?.querySelector(".service-icon");

		  if (circleIconEl && serviceIcon) {
			circleIconEl.innerHTML = serviceIcon.innerHTML;

			const svgEl = circleIconEl.querySelector("svg");
			if (svgEl) {
			  gsap.fromTo(
				svgEl,
				{ scale: 0.5, opacity: 0, rotate: -20 },
				{
				  scale: 1,
				  opacity: 1,
				  rotate: 0,
				  duration: 0.5,
				  ease: "back.out(1.7)",
				  transformOrigin: "center center",
				}
			  );
			}
		  }

		  document.querySelectorAll(".step").forEach((el, idx) => {
			if (idx === index || idx === index - 1 || idx === index + 1) {
			  el.style.opacity = 1;
			  el.style.visibility = "visible";
			  el.classList.toggle("active", idx === index);
			  if (idx === index) {
				document.querySelectorAll(".step").forEach((el2) => {
				  el2.style.rotate = index * (360 / totalSteps) + "deg";
				});
			  }
			} else {
			  el.style.opacity = 0;
			  el.style.visibility = "hidden";
			  el.classList.remove("active");
			}
		  });

		  document.querySelectorAll(".service-card-box").forEach((card, idx) => {
			card.classList.toggle("active", idx === index);
		  });
		};

		updateCircle(0);
	};

	let circleSliderResizeTimer;
	window.addEventListener("resize", () => {
	  clearTimeout(circleSliderResizeTimer);
	  circleSliderResizeTimer = setTimeout(() => {
		if (
		  typeof initCircleSlider === "function" &&
		  document.getElementById("animatedCircle")
		) {
		  initCircleSlider();
		}
	  }, 250);
	});

	const headingAnimation = () => {
		gsap.registerPlugin(ScrollTrigger, SplitText);

		ScrollTrigger.getAll().forEach((trigger) => {
		  if (trigger.trigger?.classList?.contains("headline")) {
			trigger.kill();
		  }
		});

		document.fonts.ready.then(() => {
		  const container = document.body;
		  const headlines = container.querySelectorAll(".headline");

		  headlines.forEach((headline) => {
			const splitText = new SplitText(headline, {
			  type: "chars, words",
			  charsClass: "char",
			});

			const chars = splitText.chars;

			gsap.set(headline, { opacity: 0 });

			ScrollTrigger.create({
			  trigger: headline,
			  start: "top 80%",
			  once: true,
			  onEnter: () => {
				gsap.fromTo(
				  headline,
				  { opacity: 0 },
				  { opacity: 1, duration: 0.1, ease: "none" }
				);

				gsap.from(chars, {
				  duration: 1.5,
				  opacity: 0,
				  scale: 0,
				  y: 80,
				  rotationX: 180,
				  transformOrigin: "0% 50% -50",
				  ease: "back.out(1.7)",
				  stagger: 0.05,
				});
			  },
			});
		  });
		});
	};

	const handleTeamHover = () => {
		let destroyFn = null;

		ScrollTrigger.matchMedia({
		  "(min-width: 567px)": () => {
			const boxes = document.querySelectorAll(".pxl-team-list .box-item");
			const cleanups = [];

			boxes.forEach((box) => {
			  const reveal = box.querySelector(".item-image");
			  const revealImg = reveal?.querySelector(".reveal-image");

			  if (!reveal || !revealImg) return;

			  const positionElement = (ev) => {
				const parent = ev.currentTarget;
				const parentRect = parent.getBoundingClientRect();
				const parentWidth = parent.offsetWidth;
				const revealWidth = reveal.offsetWidth;
				const mouseX = ev.clientX - parentRect.left;
				const padding = 60;
				const finalX = mouseX + padding;

				reveal.style.top = "50%";
				reveal.style.transform = "translateY(-50%)";

				if (finalX + revealWidth > parentWidth) {
				  const rightDistance = parentWidth - mouseX;
				  reveal.style.right = `${rightDistance + padding}px`;
				  reveal.style.left = "auto";
				} else {
				  reveal.style.left = `${finalX}px`;
				  reveal.style.right = "auto";
				}
			  };

			  const showImage = () => {
				gsap.killTweensOf(revealImg);
				gsap
				  .timeline()
				  .set(reveal, { opacity: 1, zIndex: 1000 })
				  .fromTo(
					revealImg,
					{ scaleX: 0, opacity: 0, transformOrigin: "left center" },
					{ scaleX: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
				  );
			  };

			  const hideImage = () => {
				gsap.killTweensOf(revealImg);
				gsap
				  .timeline()
				  .to(revealImg, {
					scaleX: 0,
					opacity: 0,
					duration: 0.3,
					ease: "power2.in",
					transformOrigin: "right center",
				  })
				  .set(reveal, { opacity: 0, zIndex: "" });
			  };

			  const mouseEnterHandler = (e) => {
				positionElement(e);
				showImage();
			  };

			  const mouseMoveHandler = (e) => {
				positionElement(e);
			  };

			  box.addEventListener("mouseenter", mouseEnterHandler);
			  box.addEventListener("mousemove", mouseMoveHandler);
			  box.addEventListener("mouseleave", hideImage);

			  cleanups.push(() => {
				box.removeEventListener("mouseenter", mouseEnterHandler);
				box.removeEventListener("mousemove", mouseMoveHandler);
				box.removeEventListener("mouseleave", hideImage);
			  });
			});

			destroyFn = () => {
			  cleanups.forEach((fn) => fn());
			};
		  },
		});

		return () => {
		  if (destroyFn) destroyFn();
		};
	};

	const stickyCard = () => {
		ScrollTrigger.matchMedia({
		  "(min-width: 1200px)": () => {
			const contentElements = gsap.utils.toArray(".content--sticky");
			const total = contentElements.length;

			const triggers = [];

			contentElements.forEach((el, index) => {
			  const isLast = index === total - 1;

			  if (!isLast) {
				const pinTrigger = ScrollTrigger.create({
				  trigger: el,
				  start: "top top",
				  end: "bottom top",
				  pin: true,
				  pinSpacing: false,
				  anticipatePin: 1,
				});
				triggers.push(pinTrigger);
			  }

			  const tl = gsap.timeline({
				scrollTrigger: {
				  trigger: el,
				  start: "top top",
				  end: "+=100%",
				  scrub: true,
				},
			  });

			  tl.to(
				el,
				{
				  ease: "none",
				  startAt: { filter: "brightness(100%) contrast(100%)" },
				  filter: isLast ? "none" : "brightness(60%) contrast(135%)",
				  yPercent: isLast ? 0 : -15,
				},
				0
			  );

			  tl.to(
				el.querySelector(".content__img"),
				{
				  scale: 1.5,
				  ease: "power1.in",
				},
				0
			  );
			});

			ScrollTrigger.refresh();
			return () => {
			  triggers.forEach((trigger) => trigger.kill());
			};
		  },
		});
	};

	const headerSticky = () => {
		const header = document.querySelector(".site-header");
		const sidebarStickyWrap = document.querySelector(".sidebar-sticky");

		if (!header) return;

		let lastScroll = 0;
		let animationFrameId;

		const updateStickyHeader = (scrollY) => {
		  const scrollingDown = scrollY > lastScroll;
		  const shouldFix = !scrollingDown && scrollY > 0;

		  header.classList.toggle("is-fixed", shouldFix);

		  if (sidebarStickyWrap) {
			const headerHeight = header.offsetHeight || 80;
			sidebarStickyWrap.style.top = shouldFix
			  ? `${headerHeight + 10}px`
			  : "60%";
		  }

		  lastScroll = scrollY;
		};

		const smootherScrollLoop = () => {
		  if (typeof smoother?.scrollTop === "function") {
			const currentScroll = smoother.scrollTop();
			updateStickyHeader(currentScroll);
		  } else {
			const currentScroll =
			  window.scrollY || document.documentElement.scrollTop;
			updateStickyHeader(currentScroll);
		  }

		  animationFrameId = requestAnimationFrame(smootherScrollLoop);
		};

		animationFrameId = requestAnimationFrame(smootherScrollLoop);

		return () => {
		  if (animationFrameId) cancelAnimationFrame(animationFrameId);
		};
	};

	const linkSmoothScroll = () => {
		const clickHandler = (e) => {
		  const anchor = e.target.closest('a[href^="#"]');
		  if (!anchor) return;

		  const href = anchor.getAttribute("href");
		  if (!href || href === "#") return;

		  const targetId = href.slice(1);
		  const targetEl = document.getElementById(targetId);
		  if (!targetEl) return;

		  e.preventDefault();

		  if (typeof smoother?.scrollTo === "function") {
			smoother.scrollTo(targetEl, true);
		  } else {
			targetEl.scrollIntoView({ behavior: "smooth" });
		  }
		};

		document.addEventListener("click", clickHandler);

		return () => {
		  document.removeEventListener("click", clickHandler);
		};
	};

	let cleanupSticky = null;
	  const initStickyPosition = (selector = ".my-sticky", offset = 100) => {
		ScrollTrigger.matchMedia({
		  "(min-width: 992px)": () => {
			const elements = document.querySelectorAll(selector);
			const triggers = [];
			elements.forEach((el) => {
			  const parent = el.parentElement;
			  if (!parent) return;

			  const spacer = document.createElement("div");
			  spacer.style.position = "relative";
			  spacer.style.height = el.classList.contains("sidebar-sticky") ? 0 : `${el.offsetHeight + offset}px`;
			  parent.insertBefore(spacer, el);
			  spacer.appendChild(el);

			  Object.assign(el.style, {
				position: "absolute",
				top: el.classList.contains("space-top-0") ?  0 : `${offset}px`,
				left: 0,
				right: 0,
			  });

			  const trigger = ScrollTrigger.create({
				trigger: spacer,
				start: "top top",
				end: () => `+=${parent.offsetHeight - el.offsetHeight - offset}`,
				pin: el,
				pinSpacing: false,
				scroller: "#smooth-wrapper",
				anticipatePin: 1,
			  });

			  triggers.push({ trigger, spacer, el });
			});

			return () => {
			  triggers.forEach(({ trigger, spacer, el }) => {
				trigger.kill();

				const parent = spacer.parentElement;
				if (parent) {
				  parent.insertBefore(el, spacer);
				  parent.removeChild(spacer);
				}

				Object.assign(el.style, {
				  position: "",
				  top: "",
				  left: "",
				  right: "",
				});
			  });
			};

		  }
		});
	};  

	const applySticky = () => {
		if (cleanupSticky) cleanupSticky();       
		cleanupSticky = initStickyPosition();   
	};

	const initVideoAnimation = () => {
		const imgZoomElements = document.querySelectorAll(".img-zoom");

		imgZoomElements.forEach((imgZoom) => {
		  const target = imgZoom.querySelector(".img-box");
		  if (!target) return;

		  ScrollTrigger.create({
			trigger: imgZoom,
			start: "top+=100 bottom",
			end: "bottom top",
			scrub: true,
			onUpdate: (self) => {
			  const progress = self.progress;
			  const scaleValue = Math.min(1.5, 1 + progress);
			  target.style.transform = `scale(${scaleValue.toFixed(3)})`;
			},
		  });
		});
	};

	const customScroll = () => {
		const content = document.querySelectorAll(".custom-scroll");

		content.forEach((item) => {
		  item.addEventListener(
			"wheel",
			function (e) {
			  e.stopPropagation();
			},
			{ passive: false }
		  );

		  let startY = 0;
		  let startX = 0;

		  item.addEventListener(
			"touchstart",
			(e) => {
			  const touch = e.touches[0];
			  startY = touch.clientY;
			  startX = touch.clientX;
			},
			{ passive: true }
		  );

		  item.addEventListener(
			"touchmove",
			(e) => {
			  const touch = e.touches[0];
			  const deltaY = startY - touch.clientY;
			  const deltaX = startX - touch.clientX;

			  item.scrollTop += deltaY;
			  item.scrollLeft += deltaX;

			  startY = touch.clientY;
			  startX = touch.clientX;

			  e.stopPropagation();
			  e.preventDefault();
			},
			{ passive: false }
		  );
		});
	};

	document.querySelectorAll(".sticky-update-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
		  setTimeout(() => {
			applySticky();
		  }, 200);
		});
	});
	/* 
	const imageHover = () => {
		if (document.querySelectorAll(".dz-hover-item").length) {
		  const hoverAnimationDo = (container, images) => {
			const img = images[0];
			const displacement = container.dataset.displacement;
			const intensity = container.dataset.intensity || undefined;
			const speedIn = container.dataset.speedin || undefined;
			const speedOut = container.dataset.speedout || undefined;
			const easing = container.dataset.easing || undefined;

			const hover = new hoverEffect({
			  parent: container,
			  intensity,
			  speedIn,
			  speedOut,
			  easing,
			  hover: false,
			  image1: img.getAttribute("src"),
			  image2: img.getAttribute("src"),
			  displacementImage: displacement,
			  imagesRatio: img.naturalHeight / img.naturalWidth,
			});

			const hoverItem = container.closest(".dz-hover-item");
			if (hoverItem) {
			  hoverItem.addEventListener("mouseenter", () => hover.next());
			  hoverItem.addEventListener("mouseleave", () => hover.previous());
			}
		  };

		  const hoverAnimation = () => {
			const imageContainers = document.querySelectorAll(".dz-hover-img");

			imageContainers.forEach((container) => {
			  const images = container.querySelectorAll("img");
			  const firstImg = images[0];

			  if (firstImg.complete) {
				hoverAnimationDo(container, images);
			  } else {
				firstImg.addEventListener("load", () => {
				  hoverAnimationDo(container, images);
				});
			  }
			});
		  };

		  hoverAnimation();
		}
	};
	 */
	 
	const imageHover = () => {
	  if (window.innerWidth < 1024) return;

	  const items = document.querySelectorAll(".dz-hover-item");
	  if (!items.length) return;

	  let activeHover = null;

	  items.forEach((item) => {
		const container = item.querySelector(".dz-hover-img");
		const img = container?.querySelector("img");
		if (!container || !img) return;

		const initHover = () => {
		  const hover = new hoverEffect({
			parent: container,
			intensity: container.dataset.intensity || 0.3,
			speedIn: container.dataset.speedin || 1.2,
			speedOut: container.dataset.speedout || 1,
			easing: container.dataset.easing || "expo.out",
			hover: false,
			image1: img.src,
			image2: img.src,
			displacementImage: container.dataset.displacement, // ✅ STRING
			imagesRatio: img.naturalHeight / img.naturalWidth,
		  });

		  item.addEventListener("mouseenter", () => {
			if (activeHover && activeHover !== hover) {
			  activeHover.previous();
			}
			activeHover = hover;
			hover.next();
		  });

		  item.addEventListener("mouseleave", () => {
			hover.previous();
		  });
		};

		if (img.complete) {
		  initHover();
		} else {
		  img.addEventListener("load", initHover);
		}
	  });
	};

	 
	const handleBtnHover = () => {
		class FlairButton {
		  constructor(buttonElement) {
			this.button = buttonElement;
			this.flair = buttonElement.querySelector(".button-flair");

			if (!this.flair) return;

			this.xSet = gsap.quickSetter(this.flair, "xPercent");
			this.ySet = gsap.quickSetter(this.flair, "yPercent");

			this.mouseEnterHandler = (e) => {
			  const { x, y } = this.getXY(e);
			  this.xSet(x);
			  this.ySet(y);
			  gsap.to(this.flair, {
				scale: 1,
				duration: 0.4,
				ease: "power2.out",
			  });
			};

			this.mouseMoveHandler = (e) => {
			  const { x, y } = this.getXY(e);
			  gsap.to(this.flair, {
				xPercent: x,
				yPercent: y,
				duration: 0.4,
				ease: "power2",
			  });
			};

			this.mouseLeaveHandler = (e) => {
			  const { x, y } = this.getXY(e);
			  gsap.killTweensOf(this.flair);
			  gsap.to(this.flair, {
				xPercent: x,
				yPercent: y,
				scale: 0,
				duration: 0.3,
				ease: "power2.out",
			  });
			};

			this.addEvents();
		  }

		  getXY(e) {
			const { left, top, width, height } = this.button.getBoundingClientRect();
			const x = gsap.utils.clamp(0, 100, gsap.utils.mapRange(0, width, 0, 100)(e.clientX - left));
			const y = gsap.utils.clamp(0, 100, gsap.utils.mapRange(0, height, 0, 100)(e.clientY - top));
			return { x, y };
		  }

		  addEvents() {
			this.button.addEventListener("mouseenter", this.mouseEnterHandler);
			this.button.addEventListener("mousemove", this.mouseMoveHandler);
			this.button.addEventListener("mouseleave", this.mouseLeaveHandler);
		  }

		  destroy() {
			this.button.removeEventListener("mouseenter", this.mouseEnterHandler);
			this.button.removeEventListener("mousemove", this.mouseMoveHandler);
			this.button.removeEventListener("mouseleave", this.mouseLeaveHandler);
		  }
		}

		const cleanupFns = [];

		const buttons = document.querySelectorAll(".flairBtn");
		if (buttons.length) {
		  buttons.forEach((btn) => {
			if (!btn.classList.contains("is-flair-initialized")) {
			  const instance = new FlairButton(btn);
			  cleanupFns.push(() => instance.destroy());
			  btn.classList.add("is-flair-initialized");
			}
		  });
		}

		const magneticBtns = document.querySelectorAll(".magneticBtn");
		if (magneticBtns.length) {
		  magneticBtns.forEach((btn) => {
			const xTo = gsap.quickTo(btn, "x", { duration: 2.0, ease: "power3.out" });
			const yTo = gsap.quickTo(btn, "y", { duration: 2.0, ease: "power3.out" });

			const handleMagneticMouseMove = (e) => {
			  const { left, top, width, height } = btn.getBoundingClientRect();
			  const x = e.clientX - (left + width / 10);
			  const y = e.clientY - (top + height / 10);
			  xTo(x);
			  yTo(y);
			};

			const handleMagneticMouseLeave = () => {
			  xTo(0);
			  yTo(0);
			};

			btn.addEventListener("mousemove", handleMagneticMouseMove);
			btn.addEventListener("mouseleave", handleMagneticMouseLeave);

			cleanupFns.push(() => {
			  btn.removeEventListener("mousemove", handleMagneticMouseMove);
			  btn.removeEventListener("mouseleave", handleMagneticMouseLeave);
			});
		  });
		}

		return () => {
		  cleanupFns.forEach((fn) => fn());
		};
	};
	
	const headingAnimationText = () => {
		const triggers = [];

		const headings = document.querySelectorAll(".pxl-heading-scroll-effect .heading-text");

		if (headings.length === 0) return;

		headings.forEach((heading) => {
		  if (!heading) return;

		  const split = new SplitText(heading, { type: "lines" });

		  split.lines.forEach((line) => {
			const tween = gsap.to(line, {
			  backgroundPositionX: "0%",
			  ease: "power2.inOut",
			  scrollTrigger: {
				trigger: line,
				start: "top 50%",
				end: "bottom center",
				scrub: 1,
			  },
			});

			if (tween.scrollTrigger) {
			  triggers.push(tween.scrollTrigger);
			}
		  });
		});

		return () => {
		  triggers.forEach((trigger) => trigger.kill());
		};
	};
	
	
	return {
		init(){
		  initCircleSlider();
		  handleTeamHover();
		  stickyCard();
		  headerSticky();
		  linkSmoothScroll();
		  applySticky();
		  initVideoAnimation();
		  headingAnimation();
		  headingAnimationText();
		  handleBtnHover();
				/* imageHover(); */
			/* setTimeout(() => {
			  requestAnimationFrame(() => {
			  });
			}, 500); */
		  customScroll();
		},
	};
};

document.addEventListener("DOMContentLoaded", () => {
   plexifyGsap().init();
});

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});


const imageHover = () => {
  if (window.innerWidth < 1024) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const items = document.querySelectorAll(".dz-hover-item");
  if (!items.length) return;

  let activeHover = null;

  window.initHoverEffect = () => {
    items.forEach(item => {
      const container = item.querySelector(".dz-hover-img");
      const img = container?.querySelector("img");
      if (!container || !img) return;

      const hover = new hoverEffect({
        parent: container,
        intensity: container.dataset.intensity || 0.3,
        speedIn: 1.2,
        speedOut: 1,
        easing: "expo.out",
        hover: false,
        image1: img.src,
        image2: img.src,
        displacementImage: container.dataset.displacement,
        imagesRatio: img.naturalHeight / img.naturalWidth,
      });

      item.addEventListener("mouseenter", () => {
        if (activeHover && activeHover !== hover) {
          activeHover.previous();
        }
        activeHover = hover;
        hover.next();
      });

      item.addEventListener("mouseleave", () => hover.previous());
    });
  };

  const loadHoverEffect = () => {
    if (window.__hoverEffectLoaded) return;
    window.__hoverEffectLoaded = true;

    const script = document.createElement("script");
    script.src = "assets/vendor/hovereffect/hover-effect.js";
    script.defer = true;
    script.onload = window.initHoverEffect;

    document.body.appendChild(script);
  };

  items.forEach(item => {
    item.addEventListener("mouseenter", loadHoverEffect, { once: true });
  });
};

window.addEventListener("load", imageHover);
