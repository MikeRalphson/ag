'use strict';

const dummy = {
  loading: {
    preferred: 'Loading...',
    versions: {
      'Loading...': {
        info: {
          description: 'Please wait...',
          title: 'Loading...'
        }
      }
    }
  }
};

function CardModel() {
    this.preferred = '';
    this.api = '';
    this.info = '';
    this.logo = '';
    this.externalUrl = '';
    this.versions = null;
    this.markedDescription = '';
}

CardModel.prototype.fromAPIs = function(apis) {
    this.preferred = apis.preferred;
    this.api = apis.versions[this.preferred];
    this.info = this.api.info;
    this.externalDocs = this.api.externalDocs || {};
    this.contact = this.info.contact || {};
    this.externalUrl = this.externalDocs.url || this.contact.url;
    this.logo = this.info['x-logo'] || {};

    var versions = [];
    $.each(apis.versions, function (version, api) {
        if (version === this.preferred) {
            return;
        }
        versions.push({
            version: version,
            swaggerUrl: api.swaggerUrl,
            swaggerYamlUrl: api.swaggerYamlUrl
        });
    });

    this.versions = versions.length > 1 ? versions : null;
    this.markedDescription = window.marked(this.info.description || '');

    return this;
};

if (window.$) {
  $(document).ready(function () {
    var cardTemplateSrc = document.querySelector('script[type="text/dot-template"]').innerText;
    var cardTemplate = window.doT.compile(cardTemplateSrc);

    var updateCards = function(data) {
        var fragment = $(document.createDocumentFragment());
        $.each(data, function (name, apis) {
            var model = new CardModel().fromAPIs(apis);
            var view = cardTemplate(model);
            fragment.append($(view));
        });

        $('#apis-list').append(fragment);
    };

    var filter = function(data, search) {
        var result = {};
        $.each(data, function (name, apis) {
            if (name.toLowerCase().indexOf(search) >= 0) {
                result[name] = apis;
            }
        });
        return result;
    };

    $.ajax({
      type: "GET",
      url: "https://api.apis.guru/v2/list.json",
      dataType: 'json',
      cache: true,
      success: function (data) {
        $('#apis-list').empty();
        updateCards(data);

        var searchInput = $('#search-input')[0];
        searchInput.addEventListener('keyup', function() {
            $('#apis-list').empty();

            var search = $('#search-input').val().toLowerCase();
            var result = filter(data, search);
            updateCards(result);
        }, false);
      }
    });

    for (let i=0;i<8;i++) { updateCards(dummy); }

  });
}