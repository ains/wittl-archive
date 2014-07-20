var tour = {
  id: "wittl",
  bubbleWidth: 300,
  steps: [
    {
      title: "Your Wittlist",
      content: "<p>Welcome to your wittlist. Here you can collect things you like around the web and use our powerful decision making tools, wittls, to compare their strengths and weaknesses.</p>",
      target: document.querySelector('.wittlist-left > header'),
      placement: "right",
      onNext: ["addSuggestedItem", "https://www.airbnb.co.uk/rooms/985087"]
    },
    {
      title: "Adding Items",
      content: "<p>Copy and paste links here to add them to your list. If you're looking for a place to stay on holiday, we've added the example below for you.<br /><br />Feel free to try your own and hit insert when you're ready!</p><br /><p><strong>Villa Casa do Alto</strong></p><img class=\"preview\" src=\"https://a0.muscache.com/pictures/33554460/large.jpg\" />",
      target: document.querySelector("#new-list-item-form"),
      placement: "bottom",
      onNext: ["clearSuggestedItem"]
    },
    {
      title: "Wittls",
      content: "<p>Now that you've added items to your wittlist, you can start to compare them with wittls.</p><p>Check what you can compare by, by clicking \"any wittl\". For example, if your holiday destination needs to be close to supermarkets, choose <strong>nearby</strong> and type in <em>supermarkets</em>.",
      target: document.querySelector(".wittls"),
      placement: "left"
    }
  ]
};

// Start the tour!
hopscotch.startTour(tour);
