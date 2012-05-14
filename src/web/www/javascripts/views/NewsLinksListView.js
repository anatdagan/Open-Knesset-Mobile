
OKnesset.app.views.NewsLinksListView = new Ext.extend(Ext.List, {
    id: 'NewsLinksListView',
    store: OKnesset.NewsLinksStore,
    itemTpl: '<div class="partyName">{url}<div class="partySize">{title}</div></div>',
    onItemDisclosure: true
});

Ext.reg('NewsLinksListView', OKnesset.app.views.NewsLinksListView);
