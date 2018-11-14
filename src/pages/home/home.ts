import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

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
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });

  constructor(public navCtrl: NavController, private geolocation: Geolocation) {

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
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  fetchDropLocation() {
    this.geolocation.getCurrentPosition().then(pos => {
      this.endLatLang = new google.maps.LatLng(pos.coords.latitude + 1, pos.coords.longitude + 1);
      this.map.setCenter(this.endLatLang);
      this.map.setZoom(8);
      console.log('Drop latLng location', this.endLatLang);
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

    this.startMarker = new google.maps.Marker({
      position: this.startLatLang,
      title: "PickUp",
      icon: { url: "assets/icon/PickUp.png", scaledSize: new google.maps.Size(25, 40) },
      map: this.map
    });

    this.stopMarker = new google.maps.Marker({
      position: this.endLatLang,
      title: "DropOff",
      icon: { url: "assets/icon/DropOff.png", scaledSize: new google.maps.Size(25, 40) },
      map: this.map
    });

    this.startMarker.setMap(this.map);
    this.stopMarker.setMap(this.map);
  }


}
