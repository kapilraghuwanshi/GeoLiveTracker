import { Component, ElementRef, ViewChild, NgZone  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  startMarker: any;
  stopMarker: any;
  startLatLang: any;
  endLatLang: any;
  moveLatLang: any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
  options = {
    enableHighAccuracy: false,
    timeout: 1000,
    maximumAge: 0
  };

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private zone : NgZone) {
  }

  ionViewDidLoad() {
    this.initMap();
  }

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 7,
      center: { lat: 17.38, lng: 78.48 }
    });
    this.directionsDisplay.setMap(this.map);
  }

  fetchCurrentLocation() {
    this.geolocation.getCurrentPosition().then(pos => {
      this.startLatLang = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      this.map.setCenter(this.startLatLang);
      this.map.setZoom(10);
      console.log('Pick latLng location', this.startLatLang);
      this.startMarker = new google.maps.Marker({
        position: this.startLatLang,
        title: "PickUp",
        icon: { url: "assets/icon/PickUp.png", scaledSize: new google.maps.Size(25, 40) },
        map: this.map,
        animation: google.maps.Animation.DROP
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  fetchDropLocation() {
    this.geolocation.getCurrentPosition().then(pos => {
      this.endLatLang = new google.maps.LatLng(pos.coords.latitude + 0.25, pos.coords.longitude);
      this.map.setCenter(this.endLatLang);
      this.map.setZoom(8);
      console.log('Drop latLng location', this.endLatLang);
      this.stopMarker = new google.maps.Marker({
        position: this.endLatLang,
        title: "DropOff",
        icon: { url: "assets/icon/DropOff.png", scaledSize: new google.maps.Size(25, 40) },
        map: this.map,
        animation: google.maps.Animation.DROP
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.startLatLang,
      destination: this.endLatLang,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

    this.startMarker.setMap(this.map);
    this.stopMarker.setMap(this.map);
  }

  liveTrack() {
    let watch = this.geolocation.watchPosition(this.options)
      .filter((position: Geoposition) => position.coords !== undefined) //Filter Out Errors
      .subscribe((position: Geoposition) => {
        console.log(position.coords.longitude + ' & ' + position.coords.latitude);
        this.moveLatLang = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log("inside live track" + this.moveLatLang);
        this.map.setCenter(this.moveLatLang);
        this.map.setZoom(9);

        this.zone.run(() => {
           this.moveLatLang = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         });

        //if (this.startMarker) {
        // Marker already created - Move it
        this.startMarker = new google.maps.Marker({
          position: this.moveLatLang,
          title: "Moving from PickUp",
          map: this.map,
          icon: { url: "assets/icon/Byk.png", scaledSize: new google.maps.Size(40, 40) },
          animation: google.maps.Animation.DROP
        });

        this.startMarker.setMap(this.map);
        //this.startMarker.setPosition(this.startLatLang);
        //}
        // else {
        //   // Marker does not exist - Create it
        //   this.startMarker = new google.maps.Marker({
        //     position: this.startLatLang,
        //     map: this.map,
        //     animation: google.maps.Animation.DROP,
        //     title: "Moving towards destination",
        //     icon: { url: "assets/icon/PickUp.png", scaledSize: new google.maps.Size(25, 40) },
        //   });
        // }
      });
    //To stop notifications
    //watch.unsubscribe();
  }


  // drop() {
  //   this.clearMarkers();
  //   for (var i = 0; i < this.neighborhoods.length; i++) {
  //     this.addMarkerWithTimeout(this.neighborhoods[i], i * 200);
  //   }
  // }

  // addMarkerWithTimeout(position, timeout) {
  //   window.setTimeout(function () {
  //     this.markers.push(new google.maps.Marker({
  //       position: position,
  //       map: this.map,
  //       animation: google.maps.Animation.DROP
  //     }));
  //   }, timeout);
  // }

  // clearMarkers() {
  //   for (var i = 0; i < this.markers.length; i++) {
  //     this.markers[i].setMap(null);
  //   }
  //   this.markers = [];
  // }


}
