type Album = {
  image: string;
  link: string;
};

export const getRandomAlbums = (number: number): Album[] => {
  console.log(albums.length);
  if (number > albums.length) return albums;
  const numberOfAlbums = albums.length;
  const numberOfRandomAlbums = number;

  const randomIndices = new Set<number>();

  while (randomIndices.size < numberOfRandomAlbums) {
    const randomIndex = Math.floor(Math.random() * numberOfAlbums);
    randomIndices.add(randomIndex);
  }

  const randomAlbums: Album[] = Array.from(randomIndices).map(index => albums[index]);

  return randomAlbums;
}

const albums: Album[] =
[
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856",
  "link": "spotify:album:6dVIqQ8qmQ5GBnJ9shOYGE"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273de3c04b5fc750b68899b20a9",
  "link": "spotify:album:5vkqYmiPBYLaalcmjujWxK"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2739293c743fa542094336c5e12",
  "link": "spotify:album:35UJLpClj5EDrhpNIi4DFg"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273e4251cf5331ad74eaaeca36e",
  "link": "spotify:album:5SKnXCvB4fcGSZu32o3LRY"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27348905438b9c1153978d9fbf4",
  "link": "spotify:album:2noRn2Aes5aoNVsU6iWThc"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2732e02117d76426a08ac7c174f",
  "link": "spotify:album:79ONNoS4M9tfIA1mYLBYVX"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27378de8b28de36a74afc0348b5",
  "link": "spotify:album:748dZDqSZy6aPXKcI9H80u"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27325b42be683b8d3c6500db726",
  "link": "spotify:album:4FCoFSNIFhK36holxHWCnc"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27396384c98ac4f3e7c2440f5b5",
  "link": "spotify:album:1EoDsNmgTLtmwe1BDAVxV5"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27392f2d790c6a97b195f66d51e",
  "link": "spotify:album:5zClcGCSWj926AMjvBNSLc"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27360ba1d6104d0475c7555a6b2",
  "link": "spotify:album:34GQP3dILpyCN018y2k61L"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27383cd9f1352bc315536480be6",
  "link": "spotify:album:0j0djiGxLnBiW7meVc2PER"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273d18aa7480fe7d5f82fc6c466",
  "link": "spotify:album:5OKJZzkMP66fr60sZ1QGqB"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2732e92f776279eaf45d14a33fd",
  "link": "spotify:album:6f6tko6NWoH00cyFOl4VYQ"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27309880a7b8636c5a0615dc0c8",
  "link": "spotify:album:6WgGWYw6XXQyLTsWt7tXky"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273fcd3724fba954e6104e4530d",
  "link": "spotify:album:5ra51AaWF3iVebyhlZ1aqq"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273431ac6e6f393acf475730ec6",
  "link": "spotify:album:55RhFRyQFihIyGf61MgcfV"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27327cc8b0ed297111f53009772",
  "link": "spotify:album:5Dgqy4bBg09Rdw7CQM545s"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2736c1e31e10c7a5b2ed2258e29",
  "link": "spotify:album:2UuvBxV56QWWj2uviGS0up"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27394d08ab63e57b0cae74e8595",
  "link": "spotify:album:2Y9IRtehByVkegoD7TcLfi"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273609c89ad17eb28c2013c56c6",
  "link": "spotify:album:6k3vC8nep1BfqAIJ81L6OL"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2735b924aa009b61b6b9d831eec",
  "link": "spotify:album:7KtyUeiJidoZO0ybxBXw0Q"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2735d48e2f56d691f9a4e4b0bdf",
  "link": "spotify:album:5Dbax7G8SWrP9xyzkOvy2F"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2733818b4c636e2a7fdea3bf965",
  "link": "spotify:album:5GRnydamKvIeG46dycID6v"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273de437d960dda1ac0a3586d97",
  "link": "spotify:album:2ANVost0y2y52ema1E9xAZ"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273175c577a61aa13d4fb4b6534",
  "link": "spotify:album:5wtE5aLX5r7jOosmPhJhhk"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2732172b607853fa89cefa2beb4",
  "link": "spotify:album:5lKlFlReHOLShQKyRv6AL9"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273cae6e44dcc84e2035c3ad092",
  "link": "spotify:album:4rJDCELWL0fjdmN9Gn4f4g"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25",
  "link": "spotify:album:0ETFjACtuP2ADo6LFhL6HN"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273d0c72291cd96834e199e1ff8",
  "link": "spotify:album:7EpUpNUkkEGnaCvkcn1j4H"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2731c0bcf8b536295438d26c70d",
  "link": "spotify:album:4GGazqHvuKwxBjWLFaJkDL"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937",
  "link": "spotify:album:4m2880jivSbbyEGAKfITCa"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2730ab3c2a306c614fae36ff1d6",
  "link": "spotify:album:0DQyTVcDhK9wm0f6RaErWO"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2734fbf52b8c98e5c6fbaeb504b",
  "link": "spotify:album:0U8kr1FIR4vhDRqKomi62M"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2737d15fb20303a589acc1ab98b",
  "link": "spotify:album:0XnqQzdSFAml08XZoRt1St"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2737f04eef099ddb5c34a1f3afc",
  "link": "spotify:album:0YS25Dr3hMtMFlVTfuvzl4"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27319d85a472f328a6ed9b704cf",
  "link": "spotify:album:0bUTHlWbkSQysoM3VsWldT"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2732aa34d5906e01231eff70f82",
  "link": "spotify:album:0eUUQ4rly8Q8PyJPWLgde2"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273042dbf8721e37f11843bfeac",
  "link": "spotify:album:0u7sgzvlLmPLvujXxy9EeY"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273238290ae5b71b71aa8178e9d",
  "link": "spotify:album:1KQGEF23vxXUWtfO0x3BV2"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27379f39680d0a747ccd91520ec",
  "link": "spotify:album:1OnCqi7IuzjnrOh2ZNvJHd"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273a90d170c61fb7d063d47161d",
  "link": "spotify:album:1XslIirSxfAhhxRdn4Li9t"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273345536847e60f622ee0eae96",
  "link": "spotify:album:1xpGyKyV26uPstk1Elgp9Q"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273f8553e18a11209d4becd0336",
  "link": "spotify:album:2B87zXm9bOWvAJdkJBTpzF"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273d95ab48a8a9de3c4a2cbfe80",
  "link": "spotify:album:2VBcztE58pBKjIDS5oEgFh"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273661d019f34569f79eae9e985",
  "link": "spotify:album:2dIGnmEIy1WZIcZCFSj6i8"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27356ac7b86e090f307e218e9c8",
  "link": "spotify:album:2fYhqwDWXjbpjaIJPEfKFw"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2738940ac99f49e44f59e6f7fb3",
  "link": "spotify:album:2nkto6YNI4rUYTLqEwWJ3o"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273bfa99afb5ef0d26d5064b23b",
  "link": "spotify:album:2xkZV2Hl1Omi8rk2D7t5lN"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273310d9098fbbde47bf7785637",
  "link": "spotify:album:2xoj2gYed3IYmGWn3owSfu"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273532391d63cfd6d32677f7af6",
  "link": "spotify:album:3DrgM5X3yX1JP1liNLAOHI"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273045fc920ecf4f8094888ec26",
  "link": "spotify:album:3kEtdS2pH6hKcMU9Wioob1"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526",
  "link": "spotify:album:3mH6qwIy9crq0I9YQbOuDf"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273524aa1b58c9b19480d8ee703",
  "link": "spotify:album:3rqqwtJE89WoWvMyPTvbZc"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273c41f4e1133b0e6c5fcf58680",
  "link": "spotify:album:48D1hRORqJq52qsnUYZX56"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273f78c98bbf2b3c9e2a764203e",
  "link": "spotify:album:4Carzsnpd6yvuHZ49I0oz8"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe",
  "link": "spotify:album:4LH4d3cOWNNsVw41Gqt2kv"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2736cfd9a7353f98f5165ea6160",
  "link": "spotify:album:4PWBTB6NYSKQwfo79I3prg"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27325b055377757b3cdd6f26b78",
  "link": "spotify:album:4Uv86qWpGTxf7fU7lG5X6F"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27326f7f19c7f0381e56156c94a",
  "link": "spotify:album:4SZko61aMnmgvNhfhgTuD3"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27314f8df9fb9c2d3056a994390",
  "link": "spotify:album:4sW8Eql2e2kdRP1A1R1clG"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27398260c528e6eec9dd431c1d7",
  "link": "spotify:album:4xwx0x7k6c5VuThz5qVqmV"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
  "link": "spotify:album:4yP0hdKOZPNshxUOjY0cZj"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273f8aaeba5e6dee1745371e822",
  "link": "spotify:album:51WLEfPEEkzAWurvuY6Gco"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273c984eaf4d6a23e0bc64041d6",
  "link": "spotify:album:5COXoP5kj2DWfCDg0vxi4F"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2735ac2c6a71a5882025e438424",
  "link": "spotify:album:6HQo3byKYGsHxOqofRmgCh"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273397d02cfe1aab2923f9d1697",
  "link": "spotify:album:6Jx4cGhWHewTcfKDJKguBQ"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273b0b3bd1a5f3967705579e6f1",
  "link": "spotify:album:755yBlrk0Sz8tIgMMTgyr1"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2737513c4956ea5552caf02eab6",
  "link": "spotify:album:7GoZNNb7Yl74fpk8Z6I2cv"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273b1ae0b2d12d647e818afabe4",
  "link": "spotify:album:7HBzTTfJhW9sis8yvgxmL6"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273ceb24a1906254750e82c1db7",
  "link": "spotify:album:7HJSVyFzG1sM02weSAqhdH"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27333c6b920eabcf4c00d7a1093",
  "link": "spotify:album:4UlGauD7ROb3YbVOFMgW5u"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273992370c34c86fda1e172d0c5",
  "link": "spotify:album:0h19Ty9F2Ma8pKkRdx17UT"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273ad08f4b38efbff0c0da0f252",
  "link": "spotify:album:5G5UwqPsxDKpxJLX4xsyuh"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2732f2eeee9b405f4d00428d84c",
  "link": "spotify:album:2u30gztZTylY4RG7IvfXs8"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27389992f4d7d4ab94937bf9e23",
  "link": "spotify:album:7dK54iZuOxXFarGhXwEXfF"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273879e9318cb9f4e05ee552ac9",
  "link": "spotify:album:5XpEKORZ4y6OrCZSKsi46A"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273c7ea04a9b455e3f68ef82550",
  "link": "spotify:album:6X1x82kppWZmDzlXXK3y3q"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273d7f3e4d143c198d3542a775d",
  "link": "spotify:album:655KljKIXl42fiNDMKivbY"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273f38c6b37a21334e22005b1f7",
  "link": "spotify:album:1p12OAWwudgMqfMzjMvl2a"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2731a84d71391df7469c5ab8539",
  "link": "spotify:album:0bCAjiUamIFqKJsekOYuRw"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2737005885df706891a3c182a57",
  "link": "spotify:album:5zi7WsKlIiUXv09tbGLKsE"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2736ca5c90113b30c3c43ffb8f4",
  "link": "spotify:album:2cWBwpqMsDJC1ZUwz813lo"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5",
  "link": "spotify:album:392p3shh2jkxUxY2VHvlH8"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27354823b660c0985479ea17f08",
  "link": "spotify:album:12Biup1Sq5hpHsX85gJPb2"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2731f478dacb513e939f5ac0586",
  "link": "spotify:album:5IyHtkKQvafw7bQYFnx4FO"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27358267bd34420a00d5cf83a49",
  "link": "spotify:album:31qVWUdRrlb8thMvts0yYL"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273f6b55ca93bd33211227b502b",
  "link": "spotify:album:1uyf3l2d4XYwiEqAb7t7fX"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452",
  "link": "spotify:album:2ODvWsOgouMbaA5xf0RkJe"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b27350570144b4a9a459406f9a3d",
  "link": "spotify:album:0WzOtZBpXvWdNdH7hCJ4qo"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273072e9faef2ef7b6db63834a3",
  "link": "spotify:album:41GuZcammIkupMPKH2OJ6I"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2738b5511866a48597871d9aa47",
  "link": "spotify:album:7l1lqgstKqV7pmjg6UgPQG"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273a38f4c1b8f53a2f792ffb561",
  "link": "spotify:album:3HA1Ru1gEAgaxTywkJmBOL"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2737749a08ddab9edbe427e9876",
  "link": "spotify:album:5fedTyx7AnXeyxLL0giq6x"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273b111f0ccb858f42da1f91b8d",
  "link": "spotify:album:0j4s8goMrRPZWjG3v0UblY"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b2738504a0836dfaa61b28930505",
  "link": "spotify:album:3j75sKW2Lw9gUEhjNzPKn4"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273998757c19e2675eef596be0c",
  "link": "spotify:album:7rTN1XY9plvvoHiA5jY4PD"
  },
  {
  "image": "https://i.scdn.co/image/ab67616d0000b273addafcf885fe8001401379ca",
  "link": "spotify:album:7yqSkf4TGPOHUtDKMVjhbD"
  }
]

export default albums;