#!/usr/bin/python3
# -*- coding: utf-8 -*-

"""
.. module:: vision
    :platform: Unix
    :synopsis: the top-level submodule of T_System's remote_ui that contains the functions for managing of t_system's vision.

.. moduleauthor:: Cem Baybars GÜÇLÜ <cem.baybars@gmail.com>
"""
import threading
from tinydb import TinyDB, Query  # TinyDB is a lightweight document oriented database

from t_system.accession import is_admin
from t_system import dot_t_system_dir
from t_system.motion.arm.action import predicted_actions_db
from t_system import seer


class VisionManager:
    """Class to define a manager for asynchronous work of t_system's vision ability.

        This class provides necessary initiations and a function named
        :func:`t_system.motion.LockingSystem.NonMovingTargetLocker.lock`
        for the provide move of servo motor during locking to the target.
    """

    def __init__(self):
        """Initialization method of :class:`t_system.motion.LockingSystem.NonMovingTargetLocker` class.
        """

        self.seer = seer

        self.seer_thread_stop = False
        # self.motor_thread_direction = None
        self.seer_thread = None

    def start_work(self, admin_id, data):
        """The high(and low)-level method to start seer's work.

        Args:
            admin_id (bool):                 Root privileges flag.
            data (dict):                    Position data structure.
        """

        result = False
        if data["work_type"] == "moving_target_track":
            self.seer_thread = threading.Thread(target=self.seer.detect_track, args=(lambda: self.seer_thread_stop,))
            result = True
        elif data["work_type"] == "non-moving_target_track":
            self.seer_thread = threading.Thread(target=self.seer.track_focused_point, args=(lambda: self.seer_thread_stop,))
            result = True
        elif data["work_type"] == "learn":
            self.seer_thread = threading.Thread(target=self.seer.learn, args=(lambda: self.seer_thread_stop,))
            result = True
        elif data["work_type"] == "security":
            self.seer_thread = threading.Thread(target=self.seer.security, args=(lambda: self.seer_thread_stop,))
            result = True

        return result

    def update_work(self, admin_id, data):
        """The high-level method to update seer's work.

        Args:
            admin_id (bool):                 Root privileges flag.
            data (dict):                    Position data structure.
        """

        self.stop_thread()

        return self.start_work(admin_id, data)

    def stop_work(self, admin_id):
        """The high-level method to stop the work.
        """

        self.stop_thread()

        return True

    def stop_thread(self):
        """The low-level method to stop the thread.
        """

        self.seer_thread_stop = True
        self.seer_thread.join()
        self.seer_thread_stop = False


def get_positions(admin_id):
    """The high-level method to return existing positions.

    Args:
        admin_id (bool):                 Root privileges flag.
    """
    try:
        table = get_db_table(is_admin(admin_id))

        result = table.all()  # result = positions

    except Exception as e:
        print(e)
        result = []

    return result


def get_position(admin_id, position_id):
    """The high-level method to return existing position with given id.

    Args:
        admin_id (bool):                 Root privileges flag.
        position_id (str):              The id of the position.
    """
    try:
        table = get_db_table(is_admin(admin_id))

        position = table.search((Query().id == position_id))

        if not position:
            result = []
        else:
            # result = [b.to_dict() for b in record]
            result = [position[0]]

    except Exception as e:
        print(e)
        result = []

    return result


def update_position(admin_id, position_id, data):
    """The high-level method to update the position that is recorded in database with given parameters.

    Args:
        admin_id (bool):                 Root privileges flag.
        position_id (str):              The id of the position.
        data (dict):                    Position data structure.
    """
    table = get_db_table(is_admin(admin_id))

    position = table.search((Query().id == position_id))

    if not position:
        result = False
    else:
        try:

            table.update({'name': data['name'], 'cartesian_coords': data['cartesian_coords'], 'polar_coords': data['polar_coords']}, Query().id == position_id)
            result = True
        except Exception:
            result = False

    return result


def delete_position(admin_id, position_id):
    """The high-level method to remove existing position with given id.

    Args:
        admin_id (bool):                 Root privileges flag.
        position_id (str):              The id of the position.
    """
    table = get_db_table(is_admin(admin_id))

    if table.search((Query().id == position_id)):
        table.remove((Query().id == position_id))

        result = True
    else:
        result = False

    return result


def get_db_table(is_admin):
    """The low-level method to set work database by root.

    Args:
        is_admin (bool):                 Root privileges flag.
    """
    if is_admin:
        db_file = predicted_actions_db
    else:
        db_file = dot_t_system_dir + "/actions.json"

    db = TinyDB(db_file)
    return db.table("positions")
