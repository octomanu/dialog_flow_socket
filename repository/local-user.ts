
import { getRepository } from "typeorm";
import { LocalUser } from "../entity/local-user";

export class LocalUserRepository {

    static findOrCreateByReferenciaExterna(usuario: { nombre: string, referencia_externa: string, id_externo: string }) {

        return this.findByReferenciaExterna(usuario.id_externo, usuario.referencia_externa).then(dbUser => {

            if (dbUser) {
                return dbUser;
            }

            const newUser = new LocalUser();
            newUser.fill(usuario.nombre, usuario.referencia_externa, usuario.id_externo);

            return newUser.save().then(savedUser => {
                return savedUser;
            });

        }).then(user => {
            return user;
        });

    }

    static findByReferenciaExterna(id_externo: string, referencia_externa: string) {
        return getRepository(LocalUser).createQueryBuilder("local_user")
            .where("local_user.referencia_externa = :referencia_externa", { referencia_externa })
            .andWhere("local_user.id_externo = :id_externo", { id_externo })
            .getOne();
    }


    static getSocketUser(id_socket: string) {
        return getRepository(LocalUser).createQueryBuilder("local_user")
            .innerJoin("local_user.sockets", "sockets")
            .where("sockets.socket = :id_socket", { id_socket })
            .getOne();
    }

}
