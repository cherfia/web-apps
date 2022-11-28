/*
 *
 * (c) Copyright Ascensio System SIA 2010-2022
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
*/
/**
 *
 *  RolesManagerDlg.js
 *
 *  Created by Julia.Radzhabova on 12.04.22
 *  Copyright (c) 2022 Ascensio System SIA. All rights reserved.
 *
 */

define([  'common/main/lib/view/AdvancedSettingsWindow',
    'common/main/lib/component/ListView',
    'documenteditor/main/app/view/RoleEditDlg',
    'documenteditor/main/app/view/RoleDeleteDlg'
], function (contentTemplate) {
    'use strict';

    DE.Views = DE.Views || {};

    DE.Views.SaveFormDlg =  Common.Views.AdvancedSettingsWindow.extend(_.extend({
        options: {
            alias: 'SaveFormDlg',
            contentWidth: 320,
            height: 280,
            buttons: null
        },

        initialize: function (options) {
            var me = this;
            _.extend(this.options, {
                title: this.txtTitle,
                template: [
                    '<div class="box" style="height:' + (this.options.height-85) + 'px;">',
                        '<div class="content-panel" style="padding: 0;">',
                            '<div class="settings-panel active">',
                                '<div class="inner-content">',
                                    '<table style="width: 100%;">',
                                        '<tr>',
                                            '<td class="padding-small">',
                                                '<label>' + this.textDescription + '</label>',
                                            '</td>',
                                        '</tr>',
                                        '<tr>',
                                            '<td>',
                                                '<label>' + this.textFill + '</label>',
                                            '</td>',
                                        '</tr>',
                                        '<tr>',
                                            '<td>',
                                                '<div id="save-form-roles-list" class="roles-tableview no-borders" style="width:100%; height: 116px;"></div>',
                                            '</td>',
                                        '</tr>',
                                    '</table>',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                    '<div class="footer center">',
                        '<button class="btn normal dlg-btn primary" result="ok" style="width: 86px;">' + this.saveButtonText + '</button>',
                        '<button class="btn normal dlg-btn" result="cancel" style="width: 86px;">' + this.cancelButtonText + '</button>',
                    '</div>'
                ].join('')
            }, options);

            this.handler    = options.handler;
            this.roles      = options.roles;

            Common.Views.AdvancedSettingsWindow.prototype.initialize.call(this, this.options);
        },
        render: function () {
            Common.Views.AdvancedSettingsWindow.prototype.render.call(this);
            var me = this;

            this.rolesList = new Common.UI.ListView({
                el: $('#save-form-roles-list', this.$window),
                store: new Common.UI.DataViewStore(),
                simpleAddMode: true,
                handleSelect: false,
                enableKeyEvents: false,
                showLast: false,
                emptyText: this.textEmpty,
                itemTemplate: _.template([
                    '<div id="<%= id %>" class="list-item" style="border-color: transparent;">',
                    '<div class="listitem-icon"><svg class=""><use xlink:href="#svg-icon-<%= scope.getIconCls(index) %>"></use></svg></div>',
                    '<div style="flex-grow: 1;padding-right: 5px;"><%= Common.Utils.String.htmlEncode(name) %></div>',
                    '</div>'
                ].join(''))
            });

            this.afterRender();
        },

        afterRender: function() {
            this.refreshRolesList(this.roles);
        },

        refreshRolesList: function(roles, selectedItem) {
            if (roles) {
                this.roles = roles;
                var arr = [];
                var me = this;
                for (var i=0; i<this.roles.length; i++) {
                    var role = roles[i].asc_getSettings();
                    (role.fields>0) && arr.push({
                        name: role.asc_getName() || me.textAnyone,
                        color: role.asc_getColor(),
                        fields: role.fields,//role.asc_getFields(),
                        index: i,
                        scope: this
                    });
                }
                this.rolesList.store.reset(arr);
            }
        },

        getIconCls: function(index) {
            if (this.rolesList.store.length===1)
                return 'Point';
            return (index===0) ? 'StartPoint' : (index===this.rolesList.store.length-1 ? 'EndPoint' : 'MiddlePoint');
        },

        txtTitle: 'Save as Form',
        saveButtonText : 'Save',
        textEmpty: 'There are no roles associated with fields.',
        textDescription: 'When saving to the oform, only roles with fields are added to the filling list',
        textFill: 'Filling list',
        textAnyone: 'Anyone'

    }, DE.Views.SaveFormDlg || {}));
});