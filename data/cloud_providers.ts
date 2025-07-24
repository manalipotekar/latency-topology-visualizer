export const cloudProviders = [
  // AWS
  {
    id: "aws-eu-central-2",
    provider: "AWS",
    location: "Zurich",
    region: "eu-central-2",
      type: "cloud",
    coordinates: [8.5417, 47.3769],
    latency: {
      aws: 13,
      gcp: 24,
      azure: 29
    }
  },
  {
    id: "aws-eu-central-1",
    provider: "AWS",
    location: "Frankfurt",
    region: "eu-central-1",
      type: "cloud",
    coordinates: [8.6821, 50.1109],
    latency: {
      aws: 12,
      gcp: 22,
      azure: 30
    }
  },
  {
    id: "aws-ap-southeast-1",
    provider: "AWS",
    location: "Singapore",
    region: "ap-southeast-1",
      type: "cloud",
    coordinates: [103.8198, 1.3521],
    latency: {
      aws: 12,
      gcp: 22,
      azure: 30
    }
  },
  {
    id: "aws-ap-northeast-1",
    provider: "AWS",
    location: "Tokyo",
    region: "ap-northeast-1",
      type: "cloud",
    coordinates: [139.6503, 35.6762],
    latency: {
      aws: 12,
      gcp: 22,
      azure: 30
    }
  },
  {
  id: "aws-us-east-1",
  provider: "AWS",
  location: "Virginia",
  region: "us-east-1",
    type: "cloud",
  coordinates: [-77.4874, 39.0438],
  latency: {
    aws: 10,
    gcp: 12,
    azure: 14
  }
},
  
  // GCP
    {
    id: "gcp-asia-northeast1",
    provider: "GCP",
    location: "Tokyo",
    region: "asia-northeast1",
      type: "cloud",
    coordinates: [139.6917, 35.6895],
    latency: {
      aws: 14,
      gcp: 12,
      azure: 20
    }
  },
   {
    id: "gcp-asia-southeast1",
    provider: "GCP",
    location: "Singapore",
    region: "asia-southeast1",
      type: "cloud",
    coordinates: [103.8198, 1.3521],
    latency: {
      aws: 19,
      gcp: 15,
      azure: 22
    }
  },
  {
    id: "gcp-europe-west1",
    provider: "GCP",
    location: "Belgium",
    region: "europe-west1",
      type: "cloud",
    coordinates: [4.4699, 50.5039],
    latency: {
      aws: 20,
      gcp: 14,
      azure: 23
    }
  },
  {
    id: "gcp-europe-west6",
    provider: "GCP",
    location: "Zurich",
    region: "europe-west6",
      type: "cloud",
    coordinates: [8.5417, 47.3769],
    latency: {
      aws: 17,
      gcp: 11,
      azure: 21
    }
  },
  {
  id: "gcp-us-central1",
  provider: "GCP",
  location: "Iowa",
  region: "us-central1",
    type: "cloud",
  coordinates: [-93.0977, 41.8780],
  latency: {
    aws: 13,
    gcp: 11,
    azure: 12
  }
},

  // Azure
 {
    id: "gcp-asia-southeast1",
    provider: "GCP",
    location: "Singapore",
    region: "asia-southeast1",
      type: "cloud",
    coordinates: [103.8198, 1.3521],
    latency: {
      aws: 19,
      gcp: 15,
      azure: 22
    }
  },
  {
    id: "gcp-europe-west1",
    provider: "GCP",
    location: "Belgium",
    region: "europe-west1",
      type: "cloud",
    coordinates: [4.4699, 50.5039],
    latency: {
      aws: 20,
      gcp: 14,
      azure: 23
    }
  },
  {
    id: "gcp-europe-west6",
    provider: "GCP",
    location: "Zurich",
    region: "europe-west6",
      type: "cloud",
    coordinates: [8.5417, 47.3769],
    latency: {
      aws: 17,
      gcp: 11,
      azure: 21
    }
  },

  // Azure
  {
    id: "azure-japan-east",
    provider: "Azure",
    location: "Tokyo",
    region: "japan-east",
      type: "cloud",
    coordinates: [139.6917, 35.6895],
    latency: {
      aws: 16,
      gcp: 18,
      azure: 12
    }
  },
  {
    id: "azure-southeast-asia",
    provider: "Azure",
    location: "Singapore",
    region: "southeast-asia",
      type: "cloud",
    coordinates: [103.8198, 1.3521],
    latency: {
      aws: 21,
      gcp: 19,
      azure: 14
    }
  },
  {
    id: "azure-west-europe",
    provider: "Azure",
    location: "Amsterdam",
    region: "west-europe",
      type: "cloud",
    coordinates: [4.9041, 52.3676],
    latency: {
      aws: 22,
      gcp: 20,
      azure: 16
    }
  },
  {
    id: "azure-switzerland-north",
    provider: "Azure",
    location: "Zurich",
    region: "switzerland-north",
      type: "cloud",
    coordinates: [8.5417, 47.3769],
    latency: {
      aws: 15,
      gcp: 17,
      azure: 10
    }
  },
  {
  id: "azure-westus",
  provider: "Azure",
  location: "California",
  region: "westus",
  type: "cloud",
  coordinates: [-121.4944, 38.5816],
  latency: {
    aws: 14,
    gcp: 17,
    azure: 10
  }
},

]