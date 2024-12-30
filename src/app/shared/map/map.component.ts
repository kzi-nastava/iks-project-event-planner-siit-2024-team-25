import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  template: `
    <div class="map-container">
      <div id="map" [style.height]="height"></div>
    </div>
  `,
  styles: [
    `
      .map-container {
        position: relative;
        width: 100%;
        border-radius: 4px;
        overflow: hidden;
      }

      #map {
        width: 100%;
        min-height: 300px;
      }
    `,
  ],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @Input() latitude = 0;
  @Input() longitude = 0;
  @Input() height = '300px';
  @Input() zoom = 13;

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private defaultIcon: L.Icon;

  constructor() {
    // Fix for default marker icon in production builds
    this.defaultIcon = L.icon({
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.latitude, this.longitude],
      zoom: this.zoom,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.marker = L.marker([this.latitude, this.longitude], {
      icon: this.defaultIcon,
      draggable: false,
    }).addTo(this.map);

    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 0);
  }

  updateMarkerPosition(lat: number, lng: number): void {
    if (this.marker && this.map) {
      const newLatLng = L.latLng(lat, lng);
      this.marker.setLatLng(newLatLng);
      this.map.setView(newLatLng, this.zoom);
    }
  }
}
