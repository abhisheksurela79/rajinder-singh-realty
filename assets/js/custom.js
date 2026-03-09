const plexify = function () {
  "use strict";
		
		// -------------------------
		//  🔟 Scroll Top Button
		// -------------------------
		const handleScrollTop = () => {
		  const scrollBtn = document.getElementById("scrollProgress");
		  if (!scrollBtn) return;

		  const circle = scrollBtn.querySelector("circle");
		  if (!circle) return;

		  const radius = circle.r.baseVal.value;
		  const circumference = 2 * Math.PI * radius;

		  // one-time setup (allowed)
		  circle.style.strokeDasharray = circumference;
		  circle.style.strokeDashoffset = circumference;

		  const updateProgress = () => {
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const docHeight =
			  document.documentElement.scrollHeight -
			  document.documentElement.clientHeight;

			const progress = scrollTop / docHeight;

			// dynamic numeric value → OK
			circle.style.strokeDashoffset =
			  circumference * (1 - progress);

			scrollBtn.classList.toggle("active", scrollTop > 200);
		  };

		  window.addEventListener("scroll", updateProgress, { passive: true });
		  updateProgress();

		  scrollBtn.addEventListener("click", () => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		  });
		};

		
		const handleSidebarMenu = () => {
		  const menuBtn = document.querySelector(".menu-btn");
		  const fullSidenav = document.querySelector(".full-sidenav");
		  const mainBar = document.querySelector(".main-bar");
		  const menuClose = document.querySelector(".menu-close");

		  const onMenuBtnClick = function () {
			this.classList.toggle("open");
			fullSidenav?.classList.toggle("show");
			mainBar?.classList.toggle("show");
			document.body.classList.toggle("menu-btn-open", this.classList.contains("open"));
		  };

		  const onMenuCloseClick = function () {
			menuBtn?.classList.remove("open");
			fullSidenav?.classList.remove("show");
			mainBar?.classList.remove("show");
			document.body.classList.remove("menu-btn-open");
		  };

		  // ---------- FIX: Update parent heights AFTER open/close ----------
		  const updateParentHeights = (submenu) => {
			let parent = submenu.parentElement;

			while (parent) {
			  if (
				parent.classList.contains("sub-menu") ||
				parent.classList.contains("mega-menu")
			  ) {
				// force reflow before calculation (fixes opposite effect)
				parent.style.maxHeight = "none";
				const height = parent.scrollHeight;

			  }
			  parent = parent.parentElement;
			}
		  };

		  const closeSiblingMenus = (link) => {
			const li = link.closest("li");
			if (!li) return;

			const parentUL = li.parentElement;
			if (!parentUL) return;

			const listItems = parentUL.children;

			for (let item of listItems) {
			  const anchor = item.querySelector(":scope > a.dz-open");
			  if (anchor && anchor !== link) {
				anchor.classList.remove("dz-open");
				const submenu = anchor.nextElementSibling;
				if (submenu) submenu.style.maxHeight = null;
			  }
			}
		  };

		  const onFullSidenavClick = function (e) {
			const link = e.target.closest("a");
			if (!link || !fullSidenav.contains(link)) return;

			const subMenu = link.nextElementSibling;

			const hasSub =
			  subMenu &&
			  (subMenu.classList.contains("sub-menu") ||
				subMenu.classList.contains("mega-menu"));

			if (!hasSub) return;

			e.preventDefault();

			const isOpen = link.classList.contains("dz-open");

			closeSiblingMenus(link);

			if (isOpen) {
			  // CLOSE
			  link.classList.remove("dz-open");
			  subMenu.style.maxHeight = null;

			  requestAnimationFrame(() => updateParentHeights(subMenu));
			} else {
			  // OPEN
			  link.classList.add("dz-open");

			  requestAnimationFrame(() => {
				subMenu.style.maxHeight = subMenu.scrollHeight + "px";

				// FIX: update parents AFTER submenu height is applied
				requestAnimationFrame(() => updateParentHeights(subMenu));
			  });
			}
		  };

		  menuBtn?.addEventListener("click", onMenuBtnClick);
		  menuClose?.addEventListener("click", onMenuCloseClick);
		  fullSidenav?.addEventListener("click", onFullSidenavClick);

		  return function removeSidebarMenuListeners() {
			menuBtn?.removeEventListener("click", onMenuBtnClick);
			menuClose?.removeEventListener("click", onMenuCloseClick);
			fullSidenav?.removeEventListener("click", onFullSidenavClick);
		  };
		};

		const handleShopSidebar = () => {
		  const shopSidebar = document.querySelector(".shop-sidebar");
		  if (!shopSidebar) return;

		  document.addEventListener("click", (e) => {
			const target = e.target;

			if (target.closest(".sidebar-open")) {
			  shopSidebar.classList.add("is-open");
			}

			if (target.closest(".sidebar-close")) {
			  shopSidebar.classList.remove("is-open");
			}
		  });
		};

		const handleWowAnimation = () => {
			if (document.querySelectorAll(".wow").length > 0) {
			  const wow = new WOW({
				boxClass: "wow",
				animateClass: "animated",
				offset: 50,
				mobile: false,
			  });
			  wow.init();
			}
		};

		// -------------------------
		// 2️⃣ Accordion
		// -------------------------
		const handleAccordion = (container = document) => {
			const accordions = container.querySelectorAll(".myAccordion");
			accordions.forEach((accordion) => {
			  if (accordion.dataset.bound === "true") return;
			  accordion.dataset.bound = "true";

			  let activeHeader = accordion.querySelector(".accordion-header.open") || null;
			  if (activeHeader) {
				const content = activeHeader.parentElement.querySelector(".accordion-content");
				const arrow = activeHeader.querySelector(".arrow");
				if (content) content.style.maxHeight = `${content.scrollHeight}px`;
				arrow?.classList.add("active");
			  }

			  accordion.addEventListener("click", (e) => {
				const header = e.target.closest(".accordion-header");
				if (!header || !accordion.contains(header)) return;

				const content = header.parentElement.querySelector(".accordion-content");
				const arrow = header.querySelector(".arrow");
				const isOpen = header.classList.contains("open");

				if (activeHeader && activeHeader !== header) {
				  activeHeader.classList.remove("open");
				  activeHeader.querySelector(".arrow")?.classList.remove("active");
				  const oldContent = activeHeader.parentElement.querySelector(".accordion-content");
				  if (oldContent) oldContent.style.maxHeight = null;
				}

				if (!isOpen) {
				  header.classList.add("open");
				  if (content) content.style.maxHeight = `${content.scrollHeight}px`;
				  arrow?.classList.add("active");
				  activeHeader = header;
				} else {
				  header.classList.remove("open");
				  if (content) content.style.maxHeight = null;
				  arrow?.classList.remove("active");
				  activeHeader = null;
				}
			  });
			});
		};
   
		const handlePriceSlider = () => {
			const setupSlider = (sliderId, minValueId, maxValueId) => {
			  const slider = document.getElementById(sliderId);
			  if (!slider) return;

			  const formatForSlider = {
				from: (formattedValue) => Number(formattedValue),
				to: (numericValue) => Math.round(numericValue),
			  };

			  noUiSlider.create(slider, {
				start: [40, 346],
				connect: true,
				format: formatForSlider,
				tooltips: [wNumb({ decimals: 1 }), true],
				range: { min: 0, max: 400 },
			  });

			  const formatValues = [
				document.getElementById(minValueId),
				document.getElementById(maxValueId),
			  ];

			  slider.noUiSlider.on("update", (values) => {
				formatValues[0].innerHTML = "Min Price: $" + values[0];
				formatValues[1].innerHTML = "Max Price: $" + values[1];
			  });
			};

			setupSlider(
			  "slider-tooltips",
			  "slider-margin-value-min",
			  "slider-margin-value-max"
			);
			setupSlider(
			  "slider-tooltips2",
			  "slider-margin-value-min2",
			  "slider-margin-value-max2"
			);
		};

		const handleColorFilter = () => {
		  const colorsInput = document.querySelectorAll(
			".color-filter .form-check-input"
		  );

		  colorsInput.forEach((item) => {
			const formCheck = item.closest(".form-check");
			if (!formCheck) return;

			const span = formCheck.querySelector("span");
			if (!span) return;

			span.style.setProperty("--color", item.value);
		  });
		};

		const handleTabs = () => {
			const tabContainers = document.querySelectorAll(".custom-tab");

			tabContainers.forEach((container) => {
			  const titles = container.querySelectorAll(".tab-title");
			  const contents = container.querySelectorAll(".tab-content");

			  titles[0]?.classList.add("active");
			  contents[0]?.classList.add("active");
			  handleAccordion(contents[0]);

			  container.addEventListener("click", (e) => {
				const clicked = e.target.closest(".tab-title");
				if (!clicked || !container.contains(clicked)) return;

				titles.forEach((t, i) => {
				  const isActive = t === clicked;
				  t.classList.toggle("active", isActive);
				  if(contents[i]){
				  contents[i].classList.toggle("active", isActive);
				  }
				  if (isActive) {
					handleAccordion(contents[i]);
				  }
				});
			  });
			});
		};

		// -------------------------
		// 5️⃣ Service Card Hover
		// -------------------------
		const handleServiceCard = () => {
			const wrapper = document.querySelector(".services-wrapper");
			if (!wrapper) return;

			let activeCard = null;
			wrapper.addEventListener("mouseover", (e) => {
			  const card = e.target.closest(".service-card");
			  if (!card || !wrapper.contains(card)) return;
			  if (activeCard === card) return;

			  activeCard?.classList.remove("active");
			  card.classList.add("active");
			  activeCard = card;
			});
		};

		// -------------------------
		// 7️⃣ Theme Button
		// -------------------------
		const handleThemeBtn = () => {
		  const urlParams = new URLSearchParams(window.location.search);
		  const dataTheme = urlParams.get("data-theme");

		  const btnLight = document.querySelector(".dark-theme");
		  const btnDark = document.querySelector(".light-theme");
		  const html = document.documentElement;

		  const THEME_KEY = "theme";
		  const DEFAULT_THEME = "dark";

		  const setCookie = (name, value, days = 30) => {
			try {
			  if (!name || typeof value !== "string") return;
			  const expires = new Date(Date.now() + days * 86400000).toUTCString();
			  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
			} catch (err) {
			  console.warn("Theme cookie set failed:", err);
			}
		  };

		  const getCookie = (name) => {
			try {
			  if (!name) return null;
			  const cookie = document.cookie
				.split("; ")
				.find(c => c.startsWith(name + "="));
			  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
			} catch (err) {
			  console.warn("Theme cookie read failed:", err);
			  return null;
			}
		  };

		  const applyTheme = (theme, triggeredByBtn = false) => {
			if (!theme || !html) return;

			const currentTheme = html.classList.contains("dark") ? "dark" : "light";

			if (
			  theme === currentTheme &&
			  (!triggeredByBtn || !dataTheme)
			) return;

			html.classList.toggle("dark", theme === "dark");
			html.classList.toggle("light", theme === "light");

			setCookie(THEME_KEY, theme);
		  };

		  // Initial theme load (URL > Cookie > Default)
		  const savedTheme = getCookie(THEME_KEY);
		  const initialTheme =
			dataTheme === "light" || dataTheme === "dark"
			  ? dataTheme
			  : ["light", "dark"].includes(savedTheme)
			  ? savedTheme
			  : DEFAULT_THEME;

		  applyTheme(initialTheme);

		  btnLight?.addEventListener("click", () => applyTheme("light", true));
		  btnDark?.addEventListener("click", () => applyTheme("dark", true));
		};


		// -------------------------
		// 9️⃣ Counter JS
		// -------------------------
		const handleCounterJS = () => {
			const counters = document.querySelectorAll(".value");
			if (!counters.length) return;
			const speed = 200;

			const runCounter = (counter) => {
			  const target = +counter.getAttribute("data-akhi");
			  let current = 0;
			  const increment = target / speed;

			  const update = () => {
				current += increment;
				if (current < target) {
				  counter.innerText = Math.ceil(current);
				  requestAnimationFrame(update);
				} else counter.innerText = target;
			  };
			  update();
			};

			const isInViewport = (el) => {
			  const rect = el.getBoundingClientRect();
			  return rect.top >= 0 && rect.bottom <= window.innerHeight;
			};

			const handleScroll = () => {
			  counters.forEach((counter) => {
				if (!counter.classList.contains("counted") && isInViewport(counter)) {
				  counter.classList.add("counted");
				  runCounter(counter);
				}
			  });
			};

			window.addEventListener("scroll", handleScroll);
			handleScroll();
		};
		
		// -------------------------
		// 1️⃣3️⃣ LightGallery
		// -------------------------
		const handleLightgallery = () => {
			const ids = ["lightgallery","lightgallery2","lightgallery3","lightgallery4","lightgallery5"];
			ids.forEach((id) => {
			  const element = document.getElementById(id);
			  if (element) {
				lightGallery(element, { plugins: [lgThumbnail, lgZoom], selector: ".lg-item", thumbnail: true, exThumbImage: "data-src" });
			  }
			});
		};

		const handleTouchSpin = () => {
		  const groups = document.querySelectorAll(".input-group");
		  if (!groups.length) return;

		  const getInputFromEvent = (e) => {
			const button = e.target.closest("[data-field]");
			if (!button) return null;

			const fieldName = button.dataset.field;
			const parent = button.closest("div, td");
			if (!parent) return null;

			return parent.querySelector(`input[name="${fieldName}"]`);
		  };

		  const updateValue = (e, delta) => {
			e.preventDefault();
			const input = getInputFromEvent(e);
			if (!input) return;

			const current = parseInt(input.value, 10) || 0;
			input.value = Math.max(0, current + delta);
		  };

		  groups.forEach((group) => {
			group.addEventListener("click", (e) => {
			  if (e.target.closest(".button-plus")) {
				updateValue(e, 1);
			  }
			  if (e.target.closest(".button-minus")) {
				updateValue(e, -1);
			  }
			});
		  });
		};

		const handleShowPass = () => {
			document.querySelectorAll(".show-pass").forEach((toggleBtn) => {
			  toggleBtn.addEventListener("click", function () {
				const input = this.parentElement.querySelector(".dz-password");

				if (!input) return;

				if (input.type === "password") {
				  input.type = "text";
				  this.classList.add("active");
				} else {
				  input.type = "password";
				  this.classList.remove("active");
				}
			  });
			});
		};

		const handleVedioPopupJS = function () {
		  const buttons = document.querySelectorAll("button[data-type]");
		  const dialog = document.getElementById("videoDialog");
		  const container = document.getElementById("videoContainer");
		  const closeBtn = document.getElementById("closeBtn");

		  if (!dialog || !container) return;

		  buttons.forEach((button) => {
			button.addEventListener("click", () => {
			  const type = button.dataset.type;
			  const src = button.dataset.src;
			  openVideo(type, src);
			});
		  });

		  closeBtn?.addEventListener("click", closeVideo);

		  function openVideo(type, src) {
			let videoHTML = "";

			if (type === "youtube" || type === "vimeo") {
			  videoHTML = `
				<iframe 
				  src="${src}?autoplay=1"
				  allow="autoplay; encrypted-media; fullscreen"
				  allowfullscreen>
				</iframe>`;
			} else if (type === "mp4") {
			  videoHTML = `
				<video controls autoplay>
				  <source src="${src}" type="video/mp4">
				  Your browser does not support the video tag.
				</video>`;
			}

			container.innerHTML = videoHTML;
			dialog.classList.add("active");
		  }

		  function closeVideo() {
			container.innerHTML = "";
			dialog.classList.remove("active");
		  }
		};


		// -------------------------
		// 8️⃣ Load More
		// -------------------------
		const handleLoadmore = () => {
			const loadMoreBtn = document.querySelector(".dz-load-more");
			if (!loadMoreBtn) return;

			let isLoading = false;
			loadMoreBtn.addEventListener("click", async (e) => {
			  e.preventDefault();
			  if (isLoading) return;

			  const url = loadMoreBtn.getAttribute("rel");
			  if (!url) return console.warn("Load more URL missing");

			  isLoading = true;
			  loadMoreBtn.classList.add("loading");
			  loadMoreBtn.setAttribute("aria-busy", "true");

			  const icon = document.createElement("i");
			  icon.className = "fa fa-refresh";
			  loadMoreBtn.appendChild(icon);

			  try {
				const res = await fetch(url, { method: "POST", headers: { "Content-Type": "text/html" } });
				if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

				const data = await res.text();
				const container = document.querySelector(".loadmore-content");
				if (!container) throw new Error("Loadmore container not found");

				container.insertAdjacentHTML("beforeend", data);
			  } catch (err) {
				console.error("Load more failed:", err);
			  } finally {
				isLoading = false;
				loadMoreBtn.classList.remove("loading");
				loadMoreBtn.removeAttribute("aria-busy");
				if (icon.parentNode === loadMoreBtn) loadMoreBtn.removeChild(icon);
			  }
			});
		};

		const handleButtonAnimations = () => {
			const animatedButtons = new WeakSet();

			document.querySelectorAll(".btn").forEach((button) => {
			  const textElement = button.querySelector(".pxl-button-text");
			  if (!textElement) return;

			  const originalText = textElement.textContent.trim();
			  textElement.dataset.originalText = originalText;

			  button.addEventListener("mouseenter", () => {
				if (animatedButtons.has(button)) return;
				animatedButtons.add(button);

				const wrappedText = [...originalText]
				  .map(
					(char) =>
					  `<span class="letter">${char === " " ? "&nbsp;" : char}</span>`
				  )
				  .join("");

				textElement.innerHTML = wrappedText;

				const letters = textElement.querySelectorAll(".letter");
				gsap.fromTo(
				  letters,
				  { opacity: 0, y: -10 },
				  {
					opacity: 1,
					y: 0,
					duration: 0.4,
					stagger: 0.05,
					ease: "power3.out",
				  }
				);
			  });

			  button.addEventListener("mouseleave", () => {
				textElement.innerHTML = textElement.dataset.originalText;
				animatedButtons.delete(button);
			  });
			});

			document.querySelectorAll(".btn-third").forEach((button) => {
			  const textElement = button.querySelector(".pxl-button-text");
			  if (!textElement) return;

			  const originalText = textElement.textContent.trim();
			  const wrappedText = [...originalText]
				.map(
				  (char) =>
					`<span class="letter">${char === " " ? "&nbsp;" : char}</span>`
				)
				.join("");

			  textElement.innerHTML = wrappedText;

			  const letters = textElement.querySelectorAll(".letter");
			  letters.forEach((letter, index) => {
				letter.style.transitionDelay = `${index * 0.045}s`;
			  });
			});
		};

		const handleHeaderOverlay = () => {
			const overlayNavbar = document.querySelector(".overlay-navbar");
			if (!overlayNavbar) return;

			const space = window.innerWidth < 1440 ? 22 : 12;
			const clipValue = overlayNavbar.offsetWidth / 2 + space;

			overlayNavbar.style.clipPath = `inset(0px 0px 0px ${clipValue}px)`;
		};

		// -------------------------
		// 1️⃣6️⃣ Set Current Year
		// -------------------------
		const handleSetCurrentYear = () => {
			const year = new Date().getFullYear();
			document.querySelectorAll(".current-year").forEach((el) => (el.innerHTML = year));
		};

		const handleCustomSelects = () => {
			document.querySelectorAll(".dynamic-select").forEach((selectElement) => {
			  createCustomSelectFromSelect(selectElement);
			});
		};

		const createCustomSelectFromSelect = (selectElement) => {
			const selectId =
			  selectElement.id || `select-${Math.random().toString(36).substr(2, 9)}`;
			const customSelectDiv = document.createElement("div");
			customSelectDiv.id = `custom-${selectId}`;
			customSelectDiv.className = "custom-select";

			const selectedDiv = document.createElement("div");
			selectedDiv.className = "select-selected";
			selectedDiv.textContent = (
			  selectElement.querySelector("option[selected]") ||
			  selectElement.options[0]
			).textContent;

			const labelText = selectElement.parentElement?.dataset?.label || "";
			if (labelText) {
			  const label = document.createElement("span");
			  label.textContent = labelText;
			  selectedDiv.appendChild(label);
			}

			customSelectDiv.appendChild(selectedDiv);

			const itemsDiv = document.createElement("div");
			itemsDiv.className = "select-items select-hide";
			customSelectDiv.appendChild(itemsDiv);

			Array.from(selectElement.options).forEach((option) => {
			  const customOptionDiv = document.createElement("div");
			  customOptionDiv.className = "select-item";
			  customOptionDiv.setAttribute("data-value", option.value);
			  customOptionDiv.textContent = option.textContent;
			  if (option.selected) customOptionDiv.classList.add("active");

			  customOptionDiv.addEventListener("click", function () {
				selectedDiv.childNodes[0].textContent = this.textContent;
				selectElement.value = this.getAttribute("data-value");
				selectElement.dispatchEvent(new Event("change"));
				selectElement.dispatchEvent(new Event("click"));

				itemsDiv.classList.add("select-hide");
				selectedDiv.classList.remove("select-active");

				itemsDiv
				  .querySelectorAll(".select-item")
				  .forEach((item) => item.classList.remove("active"));
				this.classList.add("active");
			  });

			  itemsDiv.appendChild(customOptionDiv);
			});

			selectElement.style.display = "none";
			selectElement.parentNode.insertBefore(
			  customSelectDiv,
			  selectElement.nextSibling
			);

			selectedDiv.addEventListener("click", function (e) {
			  e.stopPropagation();
			  itemsDiv.classList.toggle("select-hide");
			  selectedDiv.classList.toggle("select-active");
			});

			document.addEventListener("click", function (e) {
			  if (!customSelectDiv.contains(e.target)) {
				itemsDiv.classList.add("select-hide");
				selectedDiv.classList.remove("select-active");
			  }
			});
		};

		// -------------------------
		// 6️⃣ Pricing Hover
		// -------------------------
		const handleHoverActive = () => {
			const container = document.querySelector(".pricing-container");
			if (!container) return;

			let activeWrapper = null;
			container.addEventListener("mouseover", (e) => {
			  const target = e.target.closest(".pricing-wrapper");
			  if (!target || !container.contains(target)) return;
			  if (activeWrapper === target) return;

			  activeWrapper?.classList.remove("active");
			  target.classList.add("active");
			  activeWrapper = target;
			});
		};

		const handleStarRating = () => {
			const starRatingElements = document.querySelectorAll(".star-rating-old");
			if (starRatingElements.length > 0) {
			  new StarRating(".star-rating-old");
			}
		};

		const handleFormRecaptcha = function () {
			const form = document.querySelector(".dz-form.footer-form");
			if (!form) return;

			const requiredInputs = form.querySelectorAll(
			  'input[required]:not([type="hidden"]), textarea[required]'
			);
			const recaptchaContainer = form.querySelector(".input-recaptcha");

			if (!recaptchaContainer) return;

			recaptchaContainer.style.display = "none";

			function checkAllFieldsFilled() {
			  let allFilled = true;

			  requiredInputs.forEach((input) => {
				if (
				  input.offsetParent !== null &&
				  (!input.value || input.value.trim() === "")
				) {
				  allFilled = false;
				}
			  });

			  recaptchaContainer.style.display = allFilled ? "block" : "none";
			  return allFilled;
			}

			requiredInputs.forEach((input) => {
			  input.addEventListener("input", checkAllFieldsFilled);
			  input.addEventListener("change", checkAllFieldsFilled);
			});

			form.addEventListener("submit", (e) => {
			  if (!checkAllFieldsFilled()) {
				e.preventDefault();
			  }
			});

			checkAllFieldsFilled();
		};

		// -------------------------
		// 1️⃣1️⃣ Animation
		// -------------------------
		const handleAnimation = () => {
			const images = document.querySelectorAll(".image-zoom");
			if (!images.length) return;

			window.addEventListener("load", () => images.forEach((el) => el.classList.remove("scale-200")));
		};
		
		const handleMasonryBox = () => {
		  const masonryEls = document.querySelectorAll("#masonry, .masonry");
		  const filtersContainer = document.querySelector(".filters");

		  // Initialize Masonry
		  masonryEls.forEach((self) => {
			const cardContainers = self.querySelectorAll(".card-container");
			if (!cardContainers.length) return;

			const gutter = parseInt(self.dataset.gutter || "0", 10);
			const columnWidthValue = self.dataset.columnWidth
			  ? parseInt(self.dataset.columnWidth, 10)
			  : ".card-container";

			if (typeof Masonry !== "undefined") {
			  new Masonry(self, {
				gutter: gutter,
				columnWidth: columnWidthValue || ".card-container",
				itemSelector: ".card-container",
				isAnimated: true,
				stagger: 0,
			  });
			}
		  });

		  // Initialize Isotope
		  const masonry2El = document.querySelector(".masonry2");
		  let isoInstance = null;

		  if (masonry2El && typeof Isotope !== "undefined") {
			isoInstance = new Isotope(masonry2El, {
			  itemSelector: ".grid-item",
			  layoutMode: "masonry",
			  masonry: {
				columnWidth: ".grid-sizer",
				percentPosition: true,
			  },
			});
		  }

		  // Filters
		  if (!filtersContainer) return;

		  const filterItems = filtersContainer.querySelectorAll("li");
		  if (!filterItems.length) return;

		  const setActiveFilter = (item) => {
			filterItems.forEach((li) => li.classList.remove("active"));
			item.classList.add("active");
		  };

		  // Initial active
		  setActiveFilter(filterItems[0]);

		  filterItems.forEach((item) => {
			item.addEventListener("click", () => {
			  setActiveFilter(item);
			  const filterValue = item.dataset.filter;
			  if (isoInstance) {
				isoInstance.arrange({
				  filter: filterValue,
				  masonry: {
					columnWidth: ".grid-sizer",
					percentPosition: true,
				  },
				});
			  }
			});
		  });
		};

		const handleStatusPost = () => {
			const videoBtn = document.querySelector(".btn-Video");
			const statusModal = document.querySelector(".status-modal");
			const statusClose = document.querySelector(".status-close");
			if(!videoBtn || !statusModal) return;
			if(statusClose){
				statusClose.addEventListener('click',function(){
					statusModal.classList.add('hidden');
				})
			}
			videoBtn.addEventListener('click',function(){
				if(statusModal.classList.contains('hidden')){
					statusModal.classList.remove('hidden');
				}else{
					statusModal.classList.add('hidden');
				}
			})
		}
	
		return {
			init: function () {
			  handleScrollTop();
			  handleSidebarMenu();
			  handleWowAnimation();
			  handleAccordion();
			  handlePriceSlider();
			  handleColorFilter();
			  handleTabs();
			  handleServiceCard();
			  handleThemeBtn();
			  handleCounterJS();
			  handleVedioPopupJS();
			  handleLightgallery();
			  handleTouchSpin();
			  handleShowPass();
			  handleLoadmore();
			  handleShopSidebar();
			  handleButtonAnimations();
			  handleSetCurrentYear();
			  handleCustomSelects();
			  handleHoverActive();
			  handleStarRating();
			  handleFormRecaptcha();
			  handleAnimation();
			  handleStatusPost();
			  setTimeout(() => {
				handleHeaderOverlay();
			  }, 500);
			   setTimeout(function () {
				handleMasonryBox();
			  }, 200);
			},
			resize: function () {
			  handleHeaderOverlay();
			},
		};
	};
	window.addEventListener("load", function () {
	  if (typeof plexify !== "undefined" && typeof plexify.load === "function") {
		plexify.load();
	  }

	  setTimeout(function () {
		const loadingArea = document.getElementById("loading-area");
		if (loadingArea) {
		  loadingArea.remove();
		}
	  }, 100);
	});

	window.addEventListener("scroll", function () {
	  if (typeof plexify !== "undefined" && typeof plexify.scroll === "function") {
		plexify.scroll();
	  }
	});

	window.addEventListener("resize", function () {
	  plexify().resize();
	});

	document.addEventListener("DOMContentLoaded", function () {
	  plexify().init();
	});
