#!/usr/bin/python3
# -*- coding: utf-8 -*-

"""
.. module:: vision
    :platform: Unix
    :synopsis: the top-level submodule of T_System's remote_ui that contains the API for T_System's vision ability.

.. moduleauthor:: Cem Baybars GÜÇLÜ <cem.baybars@gmail.com>
"""

from flask import Blueprint, request
from flask_restful import Api, Resource
from schema import SchemaError

from t_system.remote_ui.modules.vision import VisionManager
from t_system.remote_ui.api.data_schema import VISION_SCHEMA

api_bp = Blueprint('vision_api', __name__)

api = Api(api_bp)


class VisionApi(Resource):
    """Class to define an API of the positions of the arm.

        This class provides necessary initiations and functions named;
         :func:`t_system.remote_ui.api.vision.VisionApi.get`for the provide get vision data from database,
         :func:`t_system.remote_ui.api.vision.VisionApi.post` for provide creating new vision,
         :func:`t_system.remote_uia.api.vision.VisionApi.put` for provide updating the vision,
         :func:`t_system.remote_ui.api.vision.VisionApi.delete` for provide deleting the vision.
    """

    def __init__(self):
        """Initialization method of :class:`t_system.remote_ui.api.vision.VisionApi` class.
        """

        self.vision_manager = VisionManager()

    def get(self):
        """The API method to get request for flask.
        """

        position_id = request.args.get('id', None)
        admin_id = request.args.get('admin_id', None)

        if position_id:
            position = get_position(admin_id, position_id)
            return {'status': 'OK', 'data': position}

        positions = get_positions(admin_id)

        return {'status': 'OK', 'data': positions}

    def post(self):
        """The API method to post request for flask.
        """
        admin_id = request.args.get('admin_id', None)

        try:
            data = VISION_SCHEMA.validate(request.form)
        except SchemaError as e:
            return {'status': 'ERROR', 'message': e.code}
        result = self.vision_manager.start_work(admin_id, data)

        return {'status': 'OK' if result else 'ERROR'}

    def put(self):
        """The API method to put request for flask.
        """
        admin_id = request.args.get('admin_id', None)

        try:
            data = VISION_SCHEMA.validate(request.form)
        except SchemaError as e:
            return {'status': 'ERROR', 'message': e.code}

        result = self.vision_manager.update_work(admin_id, data)
        return {'status': 'OK' if result else 'ERROR'}

    def delete(self):
        """The API method to delete request for flask.
        """
        admin_id = request.args.get('admin_id', None)

        result = self.vision_manager.stop_work(admin_id)

        return {'status': 'OK' if result else 'ERROR'}


api.add_resource(VisionApi, '/api/position')
