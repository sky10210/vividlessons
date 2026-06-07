/*
============================================================
VIVID LESSONS RESOURCE CARD RENDERER
============================================================

This file reads assets/resources-data.js and displays resource cards.

It hides empty sections automatically unless the target div has:
data-show-empty="true"
*/

function resourceTypePills(item){
  const pills = [];

  if(item.slideCount){
    pills.push(`${item.slideCount} Slides`);
  }

  if(item.pageCount){
    pills.push(`${item.pageCount} Pages`);
  }

  if(item.types && item.types.length){
    item.types.slice(0,3).forEach(type => pills.push(type));
  }

  if(item.editable){
    pills.push("Editable");
  }

  if(item.printable){
    pills.push("Printable");
  }

  return pills;
}

function resourceSafeId(text){
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/(^-|-$)/g,"");
}

function renderResourceCard(item, category){
  const descId = `desc-${resourceSafeId(item.id)}-${resourceSafeId(category)}`;

  const label =
    item.courseLabels && item.courseLabels.length
      ? item.courseLabels[0]
      : "Resource";

  const subtitle = item.displayType || "Classroom Resource";

  const pills = resourceTypePills(item)
    .map(pill => `<span class="pill">${pill}</span>`)
    .join("");

  const sections = item.sections && item.sections.length
    ? item.sections.map(section => `<li>${section}</li>`).join("")
    : `<li>Teacher-ready classroom resource</li><li>Student-facing support material</li>`;

  const searchText = [
    item.title,
    item.displayType,
    item.topic,
    item.description,
    item.categories ? item.categories.join(" ") : "",
    item.courseLabels ? item.courseLabels.join(" ") : "",
    item.tags ? item.tags.join(" ") : "",
    item.types ? item.types.join(" ") : ""
  ].join(" ");

  return `
    <article class="card product-card resource-card ${item.featured ? "featured" : ""}" data-title="${searchText}">
      <span class="pill">${label}</span>

      <h3>${item.title}</h3>
      <div class="item-subtitle">${subtitle}</div>

      <p>${item.description}</p>

      <div class="meta">
        ${pills}
      </div>

      <div class="price-row">
        <div class="price">${item.price || "$6"}<span><small> ${item.priceLabel || "resource"}</small></span></div>
        <small>${item.editable ? "Editable" : "Ready to use"}</small>
      </div>

      <div class="item-actions">
        <a class="btn btn-primary btn-small" href="${item.previewUrl}">Preview</a>
        <button class="btn btn-secondary btn-small" onclick="toggleItemDescription('${descId}')">Description</button>
        <a class="btn btn-shopify btn-small" href="${item.shopifyUrl}" target="_blank">Buy on Shopify</a>
        <a class="btn btn-secondary btn-small" href="${item.downloadUrl}">Access</a>
      </div>

      <div class="description-panel" id="${descId}">
        <strong>Inside this resource:</strong>
        <ul>${sections}</ul>
      </div>
    </article>
  `;
}

function renderResourceLibrary(category, targetId){
  const target = document.getElementById(targetId);

  if(!target){
    console.warn("Vivid Lessons resource renderer: target not found:", targetId);
    return;
  }

  const section = target.closest("section");
  const showEmpty = target.dataset.showEmpty === "true";

  if(typeof VIVID_RESOURCES === "undefined"){
    if(section && !showEmpty){
      section.style.display = "none";
      return;
    }

    target.innerHTML = `
      <article class="card empty-message">
        <span class="pill">Setup Needed</span>
        <h3>Resource library not loaded</h3>
        <p>Check that assets/resources-data.js is linked before resource-renderer.js.</p>
      </article>
    `;
    return;
  }

  const items = getResourcesByCategory(category);

  if(!items.length){
    if(section && !showEmpty){
      section.style.display = "none";
      return;
    }

    target.innerHTML = `
      <article class="card empty-message">
        <span class="pill">No Items</span>
        <h3>No resources added yet</h3>
        <p>Real slides, infographics, and resources added to assets/resources-data.js will appear here automatically.</p>
      </article>
    `;
    return;
  }

  if(section){
    section.style.display = "";
  }

  target.innerHTML = items
    .map(item => renderResourceCard(item, category))
    .join("");
}
