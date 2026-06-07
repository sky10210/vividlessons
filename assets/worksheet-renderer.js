/*
============================================================
VIVID LESSONS WORKSHEET CARD RENDERER
============================================================

This file reads assets/worksheets-data.js and displays worksheet cards.

It hides empty sections automatically unless the target div has:
data-show-empty="true"
*/

function worksheetTypePills(item){
  const pills = [];

  if(item.pageCount){
    pills.push(`${item.pageCount} Pages`);
  }

  if(item.types && item.types.length){
    item.types.slice(0,3).forEach(type => pills.push(type));
  }

  if(item.answerKeyIncluded){
    pills.push("Answer Key");
  }

  if(item.printable){
    pills.push("Printable");
  }

  return pills;
}

function worksheetSafeId(text){
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/(^-|-$)/g,"");
}

function renderWorksheetCard(item, category){
  const descId = `desc-${worksheetSafeId(item.id)}-${worksheetSafeId(category)}`;

  const label =
    item.courseLabels && item.courseLabels.length
      ? item.courseLabels[0]
      : "Worksheet";

  const subtitle = item.displayType || "Printable Worksheet";

  const pills = worksheetTypePills(item)
    .map(pill => `<span class="pill">${pill}</span>`)
    .join("");

  const sections = item.sections && item.sections.length
    ? item.sections.map(section => `<li>${section}</li>`).join("")
    : `<li>Student-ready printable</li><li>Teacher support materials</li>`;

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
    <article class="card product-card worksheet-card ${item.featured ? "featured" : ""}" data-title="${searchText}">
      <span class="pill">${label}</span>

      <h3>${item.title}</h3>
      <div class="item-subtitle">${subtitle}</div>

      <p>${item.description}</p>

      <div class="meta">
        ${pills}
      </div>

      <div class="price-row">
        <div class="price">${item.price || "$3"}<span><small> ${item.priceLabel || "worksheet"}</small></span></div>
        <small>${item.digitalReady ? "Digital-ready" : "Printable"}</small>
      </div>

      <div class="item-actions">
        <a class="btn btn-primary btn-small" href="${item.previewUrl}">Preview</a>
        <button class="btn btn-secondary btn-small" onclick="toggleItemDescription('${descId}')">Description</button>
        <a class="btn btn-shopify btn-small" href="${item.shopifyUrl}" target="_blank">Buy on Shopify</a>
        <a class="btn btn-secondary btn-small" href="${item.downloadUrl}">Access</a>
      </div>

      <div class="description-panel" id="${descId}">
        <strong>Inside this worksheet:</strong>
        <ul>${sections}</ul>
      </div>
    </article>
  `;
}

function renderWorksheetLibrary(category, targetId){
  const target = document.getElementById(targetId);

  if(!target){
    console.warn("Vivid Lessons worksheet renderer: target not found:", targetId);
    return;
  }

  const section = target.closest("section");
  const showEmpty = target.dataset.showEmpty === "true";

  if(typeof VIVID_WORKSHEETS === "undefined"){
    if(section && !showEmpty){
      section.style.display = "none";
      return;
    }

    target.innerHTML = `
      <article class="card empty-message">
        <span class="pill">Setup Needed</span>
        <h3>Worksheet library not loaded</h3>
        <p>Check that assets/worksheets-data.js is linked before worksheet-renderer.js.</p>
      </article>
    `;
    return;
  }

  const items = getWorksheetsByCategory(category);

  if(!items.length){
    if(section && !showEmpty){
      section.style.display = "none";
      return;
    }

    target.innerHTML = `
      <article class="card empty-message">
        <span class="pill">No Items</span>
        <h3>No worksheets added yet</h3>
        <p>Real worksheets added to assets/worksheets-data.js will appear here automatically.</p>
      </article>
    `;
    return;
  }

  if(section){
    section.style.display = "";
  }

  target.innerHTML = items
    .map(item => renderWorksheetCard(item, category))
    .join("");
}
