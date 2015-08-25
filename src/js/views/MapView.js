app.views.MapView = Backbone.View.extend({
  el: "#container",

  scale: 3, //Scale at which the world is rendered.
  planetSize: 30,
  starSize: 40,

  //a subview
  controlView: null,

  initialize: function() {
    _(this).bindAll("render", "renderStars", "positionSolarObject", "animate", "mousemove", "mouseup", "mousedown",
      "setActiveSolarObject", "solarObjectClick", "decorateSolarObject", "decoratePlanet", "decorateStar",
      "renderCanvas");

    this.collection = new app.models.GalaxyCollection();
    this.collection.fetch({reset: true, success: this.render});

    this.template = Handlebars.compile($("#map-view-template").html());
    $(document).on("saveMap", this.saveMap);
    $(document).on("restoreMap", this.restoreMap);
  },

  render: function () {
    this.$el.html(this.template);

    if(!this.collection.models[0]) {
      //we've not loaded yet, so just wait
      return this;
    }
    $("#loader").remove();

    this.stars = this.collection.starCollection.models;
    this.planets = this.collection.planetCollection.models;

    this.starCollection = this.collection.starCollection;
    this.planetCollection = this.collection.planetCollection;

    this.renderCanvas({x: 0, y:0});


    //setup control view
    this.controlView = new app.views.ControlView({
      planetCollection: this.planetCollection,
      starCollection: this.starCollection
    });
    this.controlView.render();

    return this;
  },

  renderCanvas: function(origin){
    this.renderWidth = this.$el.width();
    this.renderHeight = this.$el.height();
    this.renderer = new PIXI.autoDetectRenderer(this.renderWidth, this.renderHeight, {
      view: $("#galaxy-map")[0],
      transparent: true
    });
    this.worldStage = new PIXI.Container();
    this.stage = new PIXI.Container();

    this.worldStage.addChild(this.stage);

    this.renderStars();
    this.renderer.render(this.stage);

    $("#galaxy-map").on("mousedown", this.mousedown);
    $("#galaxy-map").on("mouseup", this.mouseup);
    $("#galaxy-map").on("mousemove", this.mousemove);
    $("#galaxy-map").on("touchstart", this.mousedown);
    $("#galaxy-map").on("touchend", this.mouseup);
    $("#galaxy-map").on("touchmove", this.mousemove);

    this.firstFrame = true;
    this.stage.position = origin;
    requestAnimationFrame(this.animate);
  },

  directRenderObject: [],

  animate: function() {
    if (this.dragging || this.firstFrame) {
      //cull offscreen planets
      var minX = -this.stage.position.x - 100;
      var maxX = -this.stage.position.x + this.renderWidth + 100;
      var minY = -this.stage.position.y - 100;
      var maxY = -this.stage.position.y + this.renderHeight + 100;

      for (var i = 0; i < this.directRenderObject.length; i++) {
        var visible =
          this.directRenderObject[i].x >= minX && this.directRenderObject[i].x <= maxX &&
          this.directRenderObject[i].y >= minY && this.directRenderObject[i].y <= maxY;

        if(this.directRenderObject[i].decorated === true){
          this.directRenderObject[i].solarObject.visible = visible;
          this.directRenderObject[i].label.visible = visible;
        }else{
          if(visible) {
            this.decorateSolarObject(this.directRenderObject[i]);

            this.directRenderObject[i].solarObject.visible = true;
            this.directRenderObject[i].label.visible = true;
          }
        }

      }
      this.firstFrame = false;
    }


    this.renderer.render(this.stage);
    requestAnimationFrame(this.animate);
  },

  events: {
    "reset": "render"
  },

  // click and drag magic
  dragging: false,
  startX: 0,
  startY: 0,
  mousedown: function (event) {
    app.mapView.dragging = true;
    app.mapView.startX = event.pageX || event.originalEvent.touches[0].pageX;
    app.mapView.startY = event.pageY || event.originalEvent.touches[0].pageY;
  },

  mousemove: function (event) {
    if(app.mapView.dragging){
      var eventX = event.pageX || event.originalEvent.touches[0].pageX;
      var eventY = event.pageY || event.originalEvent.touches[0].pageY;
      var movementX = app.mapView.startX - eventX;
      var movementY = app.mapView.startY - eventY;
      app.mapView.startX = eventX;
      app.mapView.startY = eventY;

      this.stage.position.x -= movementX;
      this.stage.position.y -= movementY;
    }
  },

  mouseup: function (event) {
    app.mapView.dragging = false;
  },

  renderStars: function() {
    this.directRenderObject = [];
    _.each(this.stars, this.positionSolarObject);
    _.each(this.planets, this.positionSolarObject);
  },

  positionSolarObject: function(body){
    this.directRenderObject.push({
      model: body,
      x: body.get("x") * this.scale,
      y:  body.get("y") * this.scale,
      decorated: false
    });
    body.decorated = false;
  },

  decorateSolarObject: function(renderObject) {
    var type = renderObject.model.get("type");
    var sprite;
    var height = this.planetSize;
    var width = this.planetSize;

    if(type == "star"){
      sprite = PIXI.Texture.fromImage("img/stars/star-type-normal.png");
      height = this.starSize;
      width = this.starSize;
    }else{
      switch(renderObject.model.get("planetType")){
        case "NORMAL":
          sprite = PIXI.Texture.fromImage("img/planets/planet-type-normal.png");
          break;
        case "EARTH_LIKE":
          sprite = PIXI.Texture.fromImage("img/planets/planet-type-earth-like.png");
          break;
        case "ICE":
          sprite = PIXI.Texture.fromImage("img/planets/planet-type-ice.png");
          break;
        case "MOLTEN":
          sprite = PIXI.Texture.fromImage("img/planets/planet-type-molten.png");
          break;
        case "GIANT":
          sprite = PIXI.Texture.fromImage("img/planets/planet-type-giant.png");
          height *= 1.5;
          width *= 1.5;
          break;
        case "SMALL":
          sprite = PIXI.Texture.fromImage("img/planets/planet-type-small.png");
          height *= 0.75;
          width *= 0.75;
          break;
        case "BARREN":
          sprite = PIXI.Texture.fromImage("img/planets/planet-type-barren.png");
          break;
      }
    }

    var solarObject = new PIXI.Sprite(sprite);
    solarObject.position.x = renderObject.x
    solarObject.position.y = renderObject.y

    solarObject.width = width;
    solarObject.height = height;

    var nameLabel = new PIXI.Text(renderObject.model.get("name"), {
      font: "15px Raleway",
      align: "center",
      fill: "#FFFFFF"
    });


    nameLabel.position = {
      x: solarObject.position.x + solarObject.width / 2,
      y: solarObject.position.y + solarObject.height
    };
    nameLabel.anchor.x = 0.5;

    solarObject.model = renderObject.model;
    solarObject.click = this.solarObjectClick;
    solarObject.tap = this.solarObjectClick;
    solarObject.interactive = true;

    renderObject.solarObject = solarObject;
    renderObject.label = solarObject;
    this.stage.addChild(solarObject);
    this.stage.addChild(nameLabel);

    renderObject.model.set("nameLabel", nameLabel);
    renderObject.model.set("solarObject", solarObject);
    renderObject.decorated = true;
  },

  decoratePlanet: function(body, parent){
    var leftObject = new PIXI.Container();
    var leftGraphics = new PIXI.Graphics();
    var textBoxWidth = 130;
    var textBoxHeight = 50;

    leftObject.position.x = parent.position.x - textBoxWidth - 30;
    leftObject.position.y = parent.position.y + parent.height / 2 - textBoxHeight / 2;

    leftGraphics.beginFill(0x0000AA);
    leftGraphics.lineStyle(2, 0x3333CC);

    leftGraphics.drawRoundedRect(
      0,
      0,
      textBoxWidth,
      textBoxHeight,
      5
    );

    leftGraphics.position.x = 0;

    var factoryLabel = new PIXI.Text("Factories: " + body.get("factories"), {
      font: "12px Raleway",
      align: "left",
      fill: "#FFFFFF"
    });
    var populationLabel = new PIXI.Text("Population: " + body.get("population"), {
      font: "12px Raleway",
      align: "left",
      fill: "#FFFFFF"
    });

    factoryLabel.x = 5;
    factoryLabel.y = 7;

    populationLabel.x = 5;
    populationLabel.y = factoryLabel.y + factoryLabel.height + 5;

    leftObject.visible = false;

    leftObject.addChild(leftGraphics);
    leftObject.addChild(factoryLabel);
    leftObject.addChild(populationLabel);

    //now make right graphics
    var rightObject = new PIXI.Container();
    var rightGraphics = new PIXI.Graphics();

    rightObject.position.x = parent.position.x + parent.width + 30;
    rightObject.position.y = parent.position.y + parent.height / 2 - textBoxHeight / 2;

    rightGraphics.beginFill(0x0000AA);
    rightGraphics.lineStyle(2, 0x3333CC);

    rightGraphics.drawRoundedRect(
      0,
      0,
      textBoxWidth,
      textBoxHeight,
      5
    );

    rightGraphics.position.x = 0;

    var typeLabel = new PIXI.Text("Type: " + body.get("planetType").toProperCase(), {
      font: "12px Raleway",
      align: "left",
      fill: "#FFFFFF"
    });
    var qualityLabel = new PIXI.Text("Quality: " + body.get("quality").toFixed(2), {
      font: "12px Raleway",
      align: "left",
      fill: "#FFFFFF"
    });
    var starLabel = new PIXI.Text("Star: " + this.starCollection.findWhere({ id: body.get("starId")}).get("name"), {
      font: "12px Raleway",
      align: "left",
      fill: "#FFFFFF"
    });

    typeLabel.x = 5;
    typeLabel.y = 2;
    qualityLabel.x = 5;
    qualityLabel.y = typeLabel.y + typeLabel.height + 3;
    starLabel.x = 5;
    starLabel.y = qualityLabel.y + qualityLabel.height + 3;

    rightObject.visible = false;

    rightObject.addChild(rightGraphics);
    rightObject.addChild(typeLabel);
    rightObject.addChild(qualityLabel);
    rightObject.addChild(starLabel);

    //halo
    var halo = new PIXI.Graphics();
    halo.position.x = parent.position.x + parent.width/2;
    halo.position.y = parent.position.y + parent.height/2;

    halo.lineStyle(2, 0xFFF01F);
    halo.drawCircle(0,0, parent.width/2 + 1);
    halo.visible = false;

    body.set("renderChildren", [
      leftObject, rightObject, halo
    ]);
    this.stage.addChild(leftObject);
    this.stage.addChild(rightObject);
    this.stage.addChild(halo);

    body.set("decorated", true);
  },

  decorateStar: function(model, parent){
    var children = this.planetCollection.where({starId: model.get("id")});
    var halos = [];

    var x = model.get("x");
    var y = model.get("y");

    for(var i = 0; i < children.length; i++){
      var childPlanet = children[i].get("solarObject");

      var halo = new PIXI.Graphics();
      halo.position.x = childPlanet.position.x + childPlanet.width/2;
      halo.position.y = childPlanet.position.y + childPlanet.height/2;

      halo.lineStyle(1, 0xAAAAFF);
      halo.drawCircle(0,0, childPlanet.width/2);
      halo.visible = false;

      this.stage.addChild(halo);
      halos.push(halo);
    }

    var halo = new PIXI.Graphics();
    halo.position.x = parent.position.x + parent.width/2;
    halo.position.y = parent.position.y + parent.height/2;

    halo.lineStyle(2, 0xFFF01F);
    halo.drawCircle(0,0, parent.width/2 + 1);
    halo.visible = false;

    this.stage.addChild(halo);
    halos.push(halo);

    model.set("renderChildren", halos);
    model.set("decorated", true);
  },

  solarObjectClick: function(event){
    this.setActiveSolarObject(event.target.model, event.target);
    $("#control-center").trigger("targetChanged", [
      event.target.model,
      event.target.model.get("type")
    ]);
  },

  activeSolarObject: null,

  setActiveSolarObject: function(model, parent){
    if(this.activeSolarObject != null && this.activeSolarObject.get("decorated") === true){
      _.each(this.activeSolarObject.get("renderChildren"), function(displayObject){
        displayObject.visible = false;
      });
    }
    this.activeSolarObject = model;
    if(this.activeSolarObject != null) {
      if(this.activeSolarObject.get("decorated") === false){
        switch(this.activeSolarObject.get("type")){
          case "planet":
            this.decoratePlanet(model, parent);
            break;
          case "star":
            this.decorateStar(model, parent);
            break;
        }
      }
      _.each(this.activeSolarObject.get("renderChildren"), function(displayObject){
        displayObject.visible = true;
      });
    }
  },
});